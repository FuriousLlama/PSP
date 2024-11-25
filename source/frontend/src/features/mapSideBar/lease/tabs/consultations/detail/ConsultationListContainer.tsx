import { useCallback, useEffect, useMemo, useState } from 'react';

import { TabInteractiveContainerProps } from '@/features/mapSideBar/shared/TabDetail';
import { useConsultationProvider } from '@/hooks/repositories/useConsultationProvider';
import { ApiGen_Concepts_ConsultationLease } from '@/models/api/generated/ApiGen_Concepts_ConsultationLease';
import { isValidId } from '@/utils';

import { IConsultationListViewProps } from './ConsultationListView';

export const ConsultationListContainer: React.FunctionComponent<
  React.PropsWithChildren<TabInteractiveContainerProps<IConsultationListViewProps>>
> = ({ fileId, pathResolverHook, View }) => {
  const [leaseConsultations, setLeaseConsultations] = useState<ApiGen_Concepts_ConsultationLease[]>(
    [],
  );

  const pathResolver = pathResolverHook();

  const {
    getLeaseConsultations: { execute: getConsultations, loading: loadingConsultations },
    deleteLeaseConsultation: { execute: deleteConsultation, loading: deletingConsultation },
  } = useConsultationProvider();

  if (!isValidId(fileId)) {
    throw new Error('Unable to determine id of current file.');
  }

  const fetchData = useCallback(async () => {
    const consultations = await getConsultations(fileId);

    if (consultations) {
      setLeaseConsultations(consultations);
    }
  }, [fileId, getConsultations]);

  const handleConsultationAdd = async () => {
    pathResolver.addDetail('lease', fileId, 'consultations');
  };

  const handleConsultationEdit = async (consultationId: number) => {
    pathResolver.editDetail('lease', fileId, 'consultations', consultationId);
  };

  const handleConsultationDeleted = async (consultationId: number) => {
    if (isValidId(consultationId)) {
      await deleteConsultation(fileId, consultationId);
      const updatedConsultations = await getConsultations(fileId);
      if (updatedConsultations) {
        setLeaseConsultations(updatedConsultations);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isLoading = useMemo(() => {
    return loadingConsultations || deletingConsultation;
  }, [deletingConsultation, loadingConsultations]);

  return fileId ? (
    <View
      loading={isLoading}
      consultations={leaseConsultations}
      onAdd={handleConsultationAdd}
      onEdit={handleConsultationEdit}
      onDelete={handleConsultationDeleted}
    />
  ) : null;
};

export default ConsultationListContainer;
