import { useContext, useEffect } from 'react';

import { LeaseStateContext } from '@/features/leases/context/LeaseContext';
import { TabInteractiveContainerProps } from '@/features/mapSideBar/shared/TabDetail';
import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';
import { useLeaseStakeholderRepository } from '@/hooks/repositories/useLeaseStakeholderRepository';
import { ApiGen_Concepts_LeaseStakeholder } from '@/models/api/generated/ApiGen_Concepts_LeaseStakeholder';

import { FormStakeholder } from './models';
import { ILeaseStakeholderViewProps } from './ViewStakeholderForm';

const LeaseStakeholderContainer: React.FunctionComponent<
  React.PropsWithChildren<TabInteractiveContainerProps<ILeaseStakeholderViewProps>>
> = ({ fileId, View }) => {
  const { lease } = useContext(LeaseStateContext);
  const getIsPayableLease = () => {
    return lease?.paymentReceivableType.id !== 'RCVBL' ? true : false;
  };
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

  return (
    <View
      stakeholders={formStakeholders}
      loading={loading}
      leaseStakeholderTypes={leaseStakeholderTypes ?? []}
      isPayableLease={getIsPayableLease()}
    />
  );
};

export default LeaseStakeholderContainer;
