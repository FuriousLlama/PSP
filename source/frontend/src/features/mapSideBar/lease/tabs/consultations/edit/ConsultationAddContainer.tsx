import axios, { AxiosError } from 'axios';
import { FormikHelpers } from 'formik';
import { toast } from 'react-toastify';

import usePathResolver from '@/features/mapSideBar/shared/sidebarPathSolver';
import { TabRouteType } from '@/features/mapSideBar/shared/tabs/RouterTabs';
import { useConsultationProvider } from '@/hooks/repositories/useConsultationProvider';
import { IApiError } from '@/interfaces/IApiError';

import { IConsultationEditFormProps } from './ConsultationEditForm';
import { ConsultationFormModel } from './models';

export interface IConsultationAddProps {
  leaseId: number;
  View: React.FunctionComponent<React.PropsWithChildren<IConsultationEditFormProps>>;
}

const ConsultationAddContainer: React.FunctionComponent<
  React.PropsWithChildren<IConsultationAddProps>
> = ({ View, leaseId }) => {
  const pathResolver = usePathResolver();

  const {
    addLeaseConsultation: { execute: addConsultation, loading: addConsultationLoading },
  } = useConsultationProvider();

  const onCreateError = (e: AxiosError<IApiError>) => {
    if (e?.response?.status === 400) {
      toast.error(e?.response.data.error);
    } else {
      toast.error('Unable to save. Please try again.');
    }
  };

  const handleSubmit = async (
    values: ConsultationFormModel,
    formikHelpers: FormikHelpers<ConsultationFormModel>,
  ) => {
    try {
      const consultationSaved = await addConsultation(leaseId, values.toApi());
      if (consultationSaved) {
        pathResolver.showDetail('lease', leaseId, TabRouteType.consultations, true);
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const axiosError = e as AxiosError<IApiError>;
        onCreateError && onCreateError(axiosError);
      }
    } finally {
      formikHelpers.setSubmitting(false);
    }
  };

  const handleCancel = () => {
    pathResolver.showDetail('lease', leaseId, TabRouteType.consultations, true);
  };

  return (
    <View
      initialValues={new ConsultationFormModel(leaseId)}
      isLoading={addConsultationLoading}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default ConsultationAddContainer;
