import React, { useCallback, useContext } from 'react';

import { LeaseStateContext } from '@/features/leases/context/LeaseContext';
import { useGenerateLicenceOfOccupation } from '@/features/mapSideBar/acquisition/common/GenerateForm/hooks/useGenerateLicenceOfOccupation';
import { TabInteractiveContainerProps } from '@/features/mapSideBar/shared/TabDetail';
import { ApiGen_Concepts_Lease } from '@/models/api/generated/ApiGen_Concepts_Lease';
import { exists } from '@/utils';

import { ILeaseDetailsViewProps } from './LeaseDetailsForm';

const LeaseDetailContainer: React.FunctionComponent<
  React.PropsWithChildren<TabInteractiveContainerProps<ILeaseDetailsViewProps>>
> = ({ fileId, pathResolverHook, View }) => {
  const { lease } = useContext(LeaseStateContext);

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
    resolver.editDetails('lease', fileId, 'checklist');
  };

  return <View lease={lease} onEdit={onEdit} onGenerate={onGenerate} />;
};

export default LeaseDetailContainer;
