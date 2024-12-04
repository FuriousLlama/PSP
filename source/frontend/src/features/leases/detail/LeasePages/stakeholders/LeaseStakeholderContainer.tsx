import { useCallback, useEffect, useState } from 'react';

import usePathResolver from '@/features/mapSideBar/shared/sidebarPathSolver';
import { TabInteractiveContainerProps } from '@/features/mapSideBar/shared/TabDetail';
import { TabRouteType } from '@/features/mapSideBar/shared/tabs/RouterTabs';
import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';
import { useLeaseStakeholderRepository } from '@/hooks/repositories/useLeaseStakeholderRepository';
import { ApiGen_Concepts_Lease } from '@/models/api/generated/ApiGen_Concepts_Lease';
import { ApiGen_Concepts_LeaseStakeholder } from '@/models/api/generated/ApiGen_Concepts_LeaseStakeholder';
import { exists } from '@/utils';

import { FormStakeholder } from './models';
import { ILeaseStakeholderViewProps } from './ViewStakeholderForm';

const LeaseStakeholderContainer: React.FunctionComponent<
  React.PropsWithChildren<TabInteractiveContainerProps<ILeaseStakeholderViewProps>>
> = ({ fileId, View }) => {
  const pathResolver = usePathResolver();

  const [lease, setLease] = useState<ApiGen_Concepts_Lease | null>(null);

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

  const {
    getLeaseStakeholders: { execute: getLeaseStakeholders, loading, response: stakeholders },
  } = useLeaseStakeholderRepository();

  const {
    getLeaseStakeholderTypes: {
      execute: getLeaseStakeholderTypes,
      response: leaseStakeholderTypes,
    },
  } = useLeaseRepository();

  useEffect(() => {
    if (lease?.id) {
      getLeaseStakeholders(lease.id);
      getLeaseStakeholderTypes();
    }
  }, [lease, getLeaseStakeholders, getLeaseStakeholderTypes]);

  const formStakeholders =
    stakeholders?.map((t: ApiGen_Concepts_LeaseStakeholder) => new FormStakeholder(t)) ?? [];

  const getIsPayableLease = useCallback(() => {
    return lease?.paymentReceivableType.id !== 'RCVBL' ? true : false;
  }, [lease?.paymentReceivableType.id]);

  const handleEdit = () => {
    pathResolver.editDetails('lease', fileId, TabRouteType.tenant);
  };

  return (
    <View
      canEdit={true}
      onEdit={handleEdit}
      stakeholders={formStakeholders}
      loading={loading}
      leaseStakeholderTypes={leaseStakeholderTypes ?? []}
      isPayableLease={getIsPayableLease()}
    />
  );
};

export default LeaseStakeholderContainer;
