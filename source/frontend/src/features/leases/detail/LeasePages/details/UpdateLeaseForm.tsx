import { Formik, FormikProps } from 'formik';

import { StyledSummarySection } from '@/components/common/Section/SectionStyles';
import { AddLeaseYupSchema } from '@/features/leases/add/AddLeaseYupSchema';
import AdministrationSubForm from '@/features/leases/add/AdministrationSubForm';
import FeeDeterminationSubForm from '@/features/leases/add/FeeDeterminationSubForm';
import LeaseDetailSubForm from '@/features/leases/add/LeaseDetailSubForm';
import RenewalSubForm from '@/features/leases/add/RenewalSubForm';
import { LeaseFormModel } from '@/features/leases/models';
import { LeasePropertySelector } from '@/features/leases/shared/propertyPicker/LeasePropertySelector';
import SidebarFooter from '@/features/mapSideBar/shared/SidebarFooter';
import { ApiGen_Concepts_Lease } from '@/models/api/generated/ApiGen_Concepts_Lease';

export interface IUpdateLeaseFormProps {
  onSubmit: (lease: LeaseFormModel) => Promise<void>;
  onClose: () => void;
  lease: ApiGen_Concepts_Lease;
  formikRef: React.Ref<FormikProps<LeaseFormModel>>;
}

export const UpdateLeaseForm: React.FunctionComponent<IUpdateLeaseFormProps> = ({
  onSubmit,
  onClose,
  lease,
  formikRef,
}) => {
  const initialForm = LeaseFormModel.fromApi(lease);

  return (
    <Formik<LeaseFormModel>
      validationSchema={AddLeaseYupSchema}
      onSubmit={values => onSubmit(values)}
      initialValues={initialForm}
      innerRef={formikRef}
    >
      {formikProps => (
        <>
          <>
            <StyledSummarySection>
              <LeaseDetailSubForm formikProps={formikProps} />
              <RenewalSubForm formikProps={formikProps} />
              <LeasePropertySelector formikProps={formikProps} />
              <AdministrationSubForm formikProps={formikProps} />
              <FeeDeterminationSubForm formikProps={formikProps} />
            </StyledSummarySection>
            <SidebarFooter
              isOkDisabled={formikProps?.isSubmitting}
              onSave={formikProps.submitForm}
              onCancel={onClose}
              displayRequiredFieldError={!formikProps.isValid && !!formikProps.submitCount}
            />
          </>
        </>
      )}
    </Formik>
  );
};

export default UpdateLeaseForm;
