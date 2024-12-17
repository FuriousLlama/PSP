import axios, { AxiosError } from 'axios';
import { FormikProps } from 'formik';
import { filter, find, orderBy, some } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { LeaseFormModel } from '@/features/leases/models';
import usePathResolver from '@/features/mapSideBar/shared/sidebarPathSolver';
import { TabRouteType } from '@/features/mapSideBar/shared/tabs/RouterTabs';
import { useApiContacts } from '@/hooks/pims-api/useApiContacts';
import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';
import { useLeaseStakeholderRepository } from '@/hooks/repositories/useLeaseStakeholderRepository';
import { useApiRequestWrapper } from '@/hooks/util/useApiRequestWrapper';
import { IContactSearchResult } from '@/interfaces';
import { IApiError } from '@/interfaces/IApiError';
import { ApiGen_Concepts_Lease } from '@/models/api/generated/ApiGen_Concepts_Lease';
import { ApiGen_Concepts_LeaseStakeholder } from '@/models/api/generated/ApiGen_Concepts_LeaseStakeholder';
import { ApiGen_Concepts_Person } from '@/models/api/generated/ApiGen_Concepts_Person';
import { exists, isValidId } from '@/utils/utils';

import { IAddLeaseStakeholderFormProps } from './AddLeaseStakeholderForm';
import { FormStakeholder } from './models';
import {
  getOrgsWithNoPrimaryContact,
  IPrimaryContactWarningModalProps,
} from './PrimaryContactWarningModal';

interface IAddLeaseStakeholderContainerProps {
  leaseId: number;
  View: React.FunctionComponent<
    React.PropsWithChildren<IAddLeaseStakeholderFormProps & IPrimaryContactWarningModalProps>
  >;
}

export const AddLeaseStakeholderContainer: React.FunctionComponent<
  React.PropsWithChildren<IAddLeaseStakeholderContainerProps>
> = ({ leaseId, View }) => {
  const [lease, setLease] = useState<ApiGen_Concepts_Lease | null>(null);

  const [initialStakeholders, setInitialStakeholders] = useState<FormStakeholder[]>([]);
  const [stakeholders, setStakeholders] = useState<FormStakeholder[]>([]);

  const [selectedContacts, setSelectedContacts] = useState<IContactSearchResult[]>(
    stakeholders.map(t => FormStakeholder.toContactSearchResult(t)) || [],
  );
  const [showContactManager, setShowContactManager] = React.useState<boolean>(false);
  const [handleSubmit, setHandleSubmit] = useState<(() => void) | undefined>(undefined);

  const pathResolver = usePathResolver();

  const { getLease } = useLeaseRepository();
  const getLeaseExecute = getLease.execute;
  const { getPersonConcept } = useApiContacts();
  const { execute: executeGetPerson } = useApiRequestWrapper({
    requestFunction: getPersonConcept,
    requestName: 'get person by id',
  });

  const {
    updateLeaseStakeholders,
    getLeaseStakeholders: { execute: getLeaseStakeholders, loading },
  } = useLeaseStakeholderRepository();

  const {
    getLeaseStakeholderTypes: {
      execute: getLeaseStakeholderTypes,
      response: leaseStakeholderTypesResponse,
    },
  } = useLeaseRepository();

  const fetchLease = useCallback(async () => {
    const leasePromise = getLeaseExecute(leaseId);
    const stakeholderPromise = getLeaseStakeholders(leaseId ?? 0);

    const [lease, stakeholders] = await Promise.all([leasePromise, stakeholderPromise]);
    await getLeaseStakeholderTypes();

    if (exists(stakeholders)) {
      setStakeholders(
        stakeholders.map((t: ApiGen_Concepts_LeaseStakeholder) => new FormStakeholder(t)),
      );
      setInitialStakeholders(
        stakeholders.map((t: ApiGen_Concepts_LeaseStakeholder) => new FormStakeholder(t)),
      );
      setSelectedContacts(
        stakeholders.map((t: ApiGen_Concepts_LeaseStakeholder) =>
          FormStakeholder.toContactSearchResult(new FormStakeholder(t)),
        ) || [],
      );
    }

    if (exists(lease)) {
      setLease(lease);
    }
  }, [getLeaseExecute, leaseId, getLeaseStakeholders, getLeaseStakeholderTypes]);

  useEffect(() => {
    fetchLease();
  }, [fetchLease]);

  const setSelectedStakeholdersWithPersonData = async (
    updatedStakeholders?: IContactSearchResult[],
  ) => {
    const allExistingStakeholderIds = stakeholders.map(t => t.id);
    const updatedStakeholderIds = updatedStakeholders?.map(t => t.id) ?? [];
    const newStakeholders = updatedStakeholders?.filter(
      t => !allExistingStakeholderIds.includes(t.id),
    );
    const matchingExistingTenants = stakeholders?.filter(t =>
      updatedStakeholderIds.includes(t?.id ?? ''),
    );

    const personPersonIdList = getStakeholderOrganizationPersonList(newStakeholders);
    // break the list up into the parts that have already been fetched and the parts that haven't been fetched.
    const unprocessedPersons = filter(personPersonIdList, p => p.person === undefined);
    const processedPersons = filter(personPersonIdList, p => p.person !== undefined).map(
      p => p.person,
    );

    // fetch any person ids that we do not have person information for.
    const personQueries = unprocessedPersons.map(person => executeGetPerson(person.personId));
    const personResponses = await Promise.all(personQueries);
    const allPersons = personResponses.concat(processedPersons);

    // append the fetched person data onto the selected tenant list.
    const tenantsWithPersons =
      newStakeholders?.map(stakeholder => {
        stakeholder?.organization?.organizationPersons?.forEach(op => {
          const matchingPerson = find(allPersons, p => p?.id === op.personId);
          if (matchingPerson) {
            op.person = matchingPerson;
          }
        });
        return stakeholder;
      }) ?? [];
    const stakeholderType = isPayableLease ? 'OWNER' : 'TEN';
    const formTenants =
      tenantsWithPersons?.map(
        t => new FormStakeholder(undefined, { contact: t, stakeholderType }),
      ) ?? [];
    setStakeholders([...formTenants, ...matchingExistingTenants]);
  };

  const formikRef = useRef<FormikProps<LeaseFormModel>>(null);

  const submit = async (leaseToUpdate: ApiGen_Concepts_Lease) => {
    if (isValidId(leaseToUpdate.id)) {
      try {
        const updatedStakeholders = await updateLeaseStakeholders.execute(
          leaseToUpdate.id,
          leaseToUpdate.stakeholders ?? [],
        );
        if (updatedStakeholders) {
          formikRef?.current?.resetForm({
            values: LeaseFormModel.fromApi({
              ...leaseToUpdate,
              stakeholders: updatedStakeholders,
            }),
          });
          onSuccess();
        }
      } catch (e) {
        if (axios.isAxiosError(e)) {
          const axiosError = e as AxiosError<IApiError>;
          if (axiosError?.response?.status === 409) {
            toast.error(axiosError?.response.data.error);
            formikRef?.current?.resetForm();
            setStakeholders(initialStakeholders ?? []);
            setSelectedContacts(
              initialStakeholders?.map(t => FormStakeholder.toContactSearchResult(t)) ?? [],
            );
          } else {
            if (axiosError.response?.status === 400) {
              toast.error(axiosError.response.data.error);
            } else {
              toast.error('Unable to save. Please try again.');
            }
          }
        }
      } finally {
        formikRef?.current?.setSubmitting(false);
      }
    }
  };

  const onSubmit = async (lease: LeaseFormModel) => {
    const leaseToUpdate = LeaseFormModel.toApi(lease);
    if (getOrgsWithNoPrimaryContact(lease.stakeholders)?.length > 0) {
      setHandleSubmit(() => () => submit(leaseToUpdate));
    } else {
      submit(leaseToUpdate);
    }
  };

  const isPayableLease = useMemo(() => {
    return lease?.paymentReceivableType.id !== 'RCVBL' ? true : false;
  }, [lease]);

  const stakeholderPageName = useMemo(
    () => (isPayableLease ? TabRouteType.tenant : TabRouteType.payee),
    [isPayableLease],
  );

  const onSuccess = () => {
    pathResolver.showDetail('lease', leaseId, stakeholderPageName, true);
  };

  const handleCancel = () => {
    setHandleSubmit(undefined);
    pathResolver.showDetail('lease', leaseId, stakeholderPageName, true);
  };

  return exists(lease) ? (
    <View
      initialValues={{ ...new LeaseFormModel(), ...LeaseFormModel.fromApi(lease) }}
      selectedContacts={selectedContacts}
      setSelectedStakeholders={setSelectedStakeholdersWithPersonData}
      selectedStakeholders={stakeholders}
      setSelectedContacts={setSelectedContacts}
      onSubmit={onSubmit}
      formikRef={formikRef}
      showContactManager={showContactManager}
      setShowContactManager={setShowContactManager}
      saveCallback={handleSubmit}
      onCancel={handleCancel}
      loading={loading}
      isPayableLease={isPayableLease}
      stakeholderTypesOptions={leaseStakeholderTypesResponse}
    />
  ) : (
    <></>
  );
};
// get a unique list of all stakeholder organization person-ids that are associated to organization stakeholders.
// in the case of a duplicate organization person, prefers stakeholders that have the person field non-null.
const getStakeholderOrganizationPersonList = (stakeholders?: IContactSearchResult[]) => {
  const personList: { person?: ApiGen_Concepts_Person; personId: number }[] = [];
  // put any stakeholders that have non-null organization person first to ensure that the de-duplication logic below will maintain that value.
  stakeholders = orderBy(
    stakeholders,
    t => some(t?.organization?.organizationPersons, op => exists(op.person)),
    'desc',
  );
  stakeholders?.forEach(stakeholder =>
    stakeholder?.organization?.organizationPersons?.forEach(op => {
      if (isValidId(op.personId) && !find(personList, p => p.personId === op.personId)) {
        personList.push({ person: op?.person ?? undefined, personId: op?.personId });
      }
    }),
  );
  return personList;
};

export default AddLeaseStakeholderContainer;
