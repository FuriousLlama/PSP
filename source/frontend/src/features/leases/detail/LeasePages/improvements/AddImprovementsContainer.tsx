import { FormikProps } from 'formik';
import { sortBy } from 'lodash';
import { useEffect, useRef } from 'react';

import * as API from '@/constants/API';
import usePathResolver from '@/features/mapSideBar/shared/sidebarPathSolver';
import { TabRouteType } from '@/features/mapSideBar/shared/tabs/RouterTabs';
import { usePropertyImprovementRepository } from '@/hooks/repositories/usePropertyImprovementRepository';
import useLookupCodeHelpers from '@/hooks/useLookupCodeHelpers';
import { ILookupCode } from '@/store/slices/lookupCodes';

import AddImprovementsForm from './AddImprovementsForm';
import { ILeaseImprovementForm, ILeaseImprovementsForm } from './models';

interface IAddImprovementsContainerProps {
  leaseId: number;
}

export const AddImprovementsContainer: React.FunctionComponent<
  React.PropsWithChildren<IAddImprovementsContainerProps>
> = ({ leaseId }) => {
  const {
    getPropertyImprovements: { execute: getPropertyImprovements, loading, response: improvements },
  } = usePropertyImprovementRepository();

  useEffect(() => {
    getPropertyImprovements(leaseId);
  }, [getPropertyImprovements, leaseId]);

  const { updatePropertyImprovements } = usePropertyImprovementRepository();
  const { getByType } = useLookupCodeHelpers();
  const improvementTypeCodes = getByType(API.PROPERTY_IMPROVEMENT_TYPES);

  const formikRef = useRef<FormikProps<ILeaseImprovementsForm>>(null);

  const onSubmit = async (form: ILeaseImprovementsForm) => {
    try {
      const apiImprovements = removeEmptyImprovements(form).improvements.map(i =>
        ILeaseImprovementForm.toApi(i),
      );
      if (leaseId) {
        const updatedPropertyImprovements = await updatePropertyImprovements.execute(
          leaseId,
          apiImprovements,
        );
        if (updatedPropertyImprovements) {
          const form = new ILeaseImprovementsForm();
          form.improvements = updatedPropertyImprovements.map(i =>
            ILeaseImprovementForm.fromApi(i),
          );
          formikRef?.current?.resetForm({ values: form });
          onSuccess();
        }
      }
    } finally {
      formikRef?.current?.setSubmitting(false);
    }
  };
  const form = new ILeaseImprovementsForm();
  form.improvements = improvements?.map(i => ILeaseImprovementForm.fromApi(i)) ?? [];
  const pathResolver = usePathResolver();
  const onSuccess = () => {
    pathResolver.showDetail('lease', leaseId, TabRouteType.improvements, true);
  };

  const onClose = () => {
    pathResolver.showDetail('lease', leaseId, TabRouteType.improvements, true);
  };

  return (
    <AddImprovementsForm
      loading={loading}
      formikRef={formikRef}
      onSubmit={onSubmit}
      onClose={onClose}
      initialValues={addEmptyImprovements(form, improvementTypeCodes, leaseId ?? undefined)}
    />
  );
};

/**
 * Populate the lease with all required improvement types, use existing values if present, otherwise inject empty, default values.
 * @param lease
 * @param improvementTypes
 */
const addEmptyImprovements = (
  lease: ILeaseImprovementsForm,
  improvementTypes: ILookupCode[],
  leaseId?: number,
): ILeaseImprovementsForm | undefined => {
  const allImprovements: ILeaseImprovementForm[] = [];

  improvementTypes.forEach(improvementType => {
    let improvementForType: ILeaseImprovementForm | undefined = lease?.improvements.find(
      existingImprovement => existingImprovement.propertyImprovementTypeId === improvementType.id,
    );
    if (improvementForType === undefined) {
      improvementForType = {
        propertyImprovementTypeId: improvementType.id as string,
        propertyImprovementType: improvementType.description ?? '',
        description: '',
        structureSize: '',
        address: '',
        leaseId: leaseId ?? 0,
      };
    }
    allImprovements.push(improvementForType);
  });
  return {
    improvements: sortBy(allImprovements, 'displayOrder'),
  } as ILeaseImprovementsForm;
};

/**
 * Remove any improvements that are empty before saving to the API.
 * @param lease
 */
const removeEmptyImprovements = (form: ILeaseImprovementsForm) => {
  return {
    ...form,
    improvements: form.improvements.filter(
      improvement =>
        !!improvement.address || !!improvement.description || !!improvement.structureSize,
    ),
  };
};
