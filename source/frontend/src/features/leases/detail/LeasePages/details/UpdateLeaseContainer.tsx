import { AxiosError } from 'axios';
import { FormikProps } from 'formik';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import LoadingBackdrop from '@/components/common/LoadingBackdrop';
import { useMapStateMachine } from '@/components/common/mapFSM/MapStateMachineContext';
import * as API from '@/constants/API';
import { useUpdateLease } from '@/features/leases/hooks/useUpdateLease';
import { LeaseFormModel } from '@/features/leases/models';
import { SideBarContext } from '@/features/mapSideBar/context/sidebarContext';
import usePathResolver from '@/features/mapSideBar/shared/sidebarPathSolver';
import { TabRouteType } from '@/features/mapSideBar/shared/tabs/RouterTabs';
import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';
import { usePropertyLeaseRepository } from '@/hooks/repositories/usePropertyLeaseRepository';
import useApiUserOverride from '@/hooks/useApiUserOverride';
import useLookupCodeHelpers from '@/hooks/useLookupCodeHelpers';
import { useModalContext } from '@/hooks/useModalContext';
import { IApiError } from '@/interfaces/IApiError';
import { ApiGen_Concepts_Lease } from '@/models/api/generated/ApiGen_Concepts_Lease';
import { UserOverrideCode } from '@/models/api/UserOverrideCode';
import { exists, isValidId } from '@/utils';

import { IUpdateLeaseFormProps } from './UpdateLeaseForm';

export interface UpdateLeaseContainerProps {
  leaseId: number;
  View: React.FunctionComponent<IUpdateLeaseFormProps>;
}

export const UpdateLeaseContainer: React.FunctionComponent<UpdateLeaseContainerProps> = ({
  leaseId,
  View,
}) => {
  const [lease, setLease] = useState<ApiGen_Concepts_Lease | null>();
  const { updateApiLease } = useUpdateLease();

  const { setStaleFile } = useContext(SideBarContext);

  const withUserOverride = useApiUserOverride<
    (userOverrideCodes: UserOverrideCode[]) => Promise<any | void>
  >('Failed to update Lease File');

  const {
    getLease: { execute: getLease, loading: getLeaseLoading },
  } = useLeaseRepository();

  const {
    getPropertyLeases: { execute: getPropertyLeases, loading: propertyLeasesLoading },
  } = usePropertyLeaseRepository();

  const { setModalContent, setDisplayModal } = useModalContext();

  const mapMachine = useMapStateMachine();

  const pathResolver = usePathResolver();

  const { getByType } = useLookupCodeHelpers();
  const consultationTypes = getByType(API.CONSULTATION_TYPES);

  const formikRef = useRef<FormikProps<any>>();

  // Not all consultations might be coming from the backend. Add the ones missing.
  //

  const fetchLease = useCallback(async () => {
    if (leaseId) {
      const getLeasePromise = getLease(leaseId);
      const getPropertiesPromise = getPropertyLeases(leaseId);

      const [leaseResponse, propertiesResponse] = await Promise.all([
        getLeasePromise,
        getPropertiesPromise,
      ]);

      if (exists(leaseResponse) && exists(propertiesResponse)) {
        leaseResponse.fileProperties = propertiesResponse;
        setLease(leaseResponse);
      }
    }
  }, [leaseId, getLease, getPropertyLeases]);

  useEffect(() => {
    fetchLease();
  }, [fetchLease]);

  const afterSubmit = useCallback(
    (updatedLease?: ApiGen_Concepts_Lease) => {
      if (isValidId(updatedLease?.id)) {
        //mapMachine.refreshMapProperties();
        setStaleFile(true);
        pathResolver.showDetail('lease', leaseId, TabRouteType.fileDetails);
      }
    },
    [leaseId, pathResolver, setStaleFile],
  );

  const onSubmit = useCallback(
    async (lease: LeaseFormModel, userOverrideCodes: UserOverrideCode[] = []) => {
      const leaseToUpdate = LeaseFormModel.toApi(lease);

      const updatedLease = await updateApiLease.execute(leaseToUpdate, userOverrideCodes);
      formikRef?.current?.setSubmitting(false);
      afterSubmit(updatedLease);
    },
    [afterSubmit, formikRef, updateApiLease],
  );

  const customErrorHandler = (e: AxiosError<IApiError>) => {
    if (e?.response?.data?.type === 'BusinessRuleViolationException') {
      setModalContent({
        title: 'Warning',
        message: e.response.data.error,
        okButtonText: 'Close',
        variant: 'error',
      });
      setDisplayModal(true);
    } else {
      throw e;
    }
  };

  const onClose = () => {
    console.log('closing');
    pathResolver.showDetail('lease', leaseId, TabRouteType.fileDetails);
  };

  if (!exists(lease)) {
    return <LoadingBackdrop parentScreen />;
  }

  return (
    <View
      onSubmit={(lease: LeaseFormModel) =>
        withUserOverride(
          (userOverrideCodes: UserOverrideCode[]) => onSubmit(lease, userOverrideCodes),

          [],
          customErrorHandler,
        )
      }
      onClose={onClose}
      lease={lease}
      formikRef={formikRef}
    />
  );
};

export default UpdateLeaseContainer;
