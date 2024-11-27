import React, { useCallback, useEffect, useState } from 'react';

import LoadingBackdrop from '@/components/common/LoadingBackdrop';
import { Claims } from '@/constants';
import { useGenerateLicenceOfOccupation } from '@/features/mapSideBar/acquisition/common/GenerateForm/hooks/useGenerateLicenceOfOccupation';
import { TabInteractiveContainerProps } from '@/features/mapSideBar/shared/TabDetail';
import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';
import useKeycloakWrapper from '@/hooks/useKeycloakWrapper';
import { ApiGen_Concepts_Lease } from '@/models/api/generated/ApiGen_Concepts_Lease';
import { exists } from '@/utils';

import { ILeaseDetailsViewProps } from './LeaseDetailsForm';

const LeaseDetailContainer: React.FunctionComponent<
  React.PropsWithChildren<TabInteractiveContainerProps<ILeaseDetailsViewProps>>
> = ({ fileId, pathResolverHook, View }) => {
  const [lease, setLease] = useState<ApiGen_Concepts_Lease | null>(null);

  const { hasClaim } = useKeycloakWrapper();
  const { getLease } = useLeaseRepository();
  const getLeaseExecute = getLease.execute;

  const fetchLease = useCallback(async () => {
    const result = await getLeaseExecute(fileId);
    if (exists(result)) {
      setLease(result);
    }
  }, [fileId, getLeaseExecute]);

  useEffect(() => {
    fetchLease();
  }, [fetchLease]);

  const resolver = pathResolverHook();
  const generateLicenceOfOccupation = useGenerateLicenceOfOccupation();

  const onGenerate = useCallback(
    (lease?: ApiGen_Concepts_Lease) => {
      if (exists(lease)) {
        generateLicenceOfOccupation(lease);
      }
    },
    [generateLicenceOfOccupation],
  );

  const onEdit = () => {
    resolver.editDetails('lease', fileId, 'fileDetails');
  };

  const canEdit = hasClaim([Claims.LEASE_EDIT]);

  if (!exists(lease)) {
    return <LoadingBackdrop />;
  } else {
    return <View lease={lease} canEdit={canEdit} onEdit={onEdit} onGenerate={onGenerate} />;
  }
};

export default LeaseDetailContainer;
