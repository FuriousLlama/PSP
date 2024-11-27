import React, { useCallback, useContext, useEffect } from 'react';

import LeaseIcon from '@/assets/images/lease-icon.svg?react';
import { useLeaseDetail } from '@/features/leases/hooks/useLeaseDetail';
import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';

import { SideBarContext } from '../context/sidebarContext';
import MapSideBarLayout from '../layout/MapSideBarLayout';
import LeaseHeader from './common/LeaseHeader';
import LeaseBodyRouter from './router/LeaseBodyRouter';

export interface ILeaseContainerProps {
  leaseId: number;
  onClose?: () => void;
}

export const LeaseContainer: React.FC<ILeaseContainerProps> = ({ leaseId, onClose }) => {
  const close = useCallback(() => onClose && onClose(), [onClose]);
  const { lease, refresh, loading } = useLeaseDetail(leaseId);
  const {
    setStaleFile,
    staleFile,
    setStaleLastUpdatedBy,
    setLastUpdatedBy,
    staleLastUpdatedBy,
    lastUpdatedBy,
  } = useContext(SideBarContext);

  const {
    getLastUpdatedBy: { execute: getLastUpdatedBy, loading: getLastUpdatedByLoading },
  } = useLeaseRepository();

  const fetchLastUpdatedBy = useCallback(async () => {
    if (leaseId) {
      const retrieved = await getLastUpdatedBy(leaseId);
      if (retrieved !== undefined) {
        setLastUpdatedBy(retrieved);
      } else {
        setLastUpdatedBy(null);
      }
    }
  }, [leaseId, getLastUpdatedBy, setLastUpdatedBy]);

  useEffect(() => {
    const refreshLease = async () => {
      await refresh();
    };

    if (staleFile) {
      refreshLease();
      setStaleFile(false);
    }
  }, [staleFile, refresh, setStaleFile]);

  useEffect(() => {
    if (lastUpdatedBy === undefined || leaseId !== lastUpdatedBy?.parentId || staleLastUpdatedBy) {
      fetchLastUpdatedBy();
    }
  }, [fetchLastUpdatedBy, lastUpdatedBy, leaseId, staleLastUpdatedBy]);

  const isEditing = false;

  return (
    <MapSideBarLayout
      showCloseButton
      onClose={close}
      title={isEditing ? 'Update Lease / Licence' : 'Lease / Licence'}
      icon={
        <LeaseIcon
          title="Lease file icon"
          width="2.6rem"
          height="2.6rem"
          fill="currentColor"
          className="mr-2"
        />
      }
      header={<LeaseHeader lease={lease} lastUpdatedBy={lastUpdatedBy} />}
    >
      <LeaseBodyRouter />
    </MapSideBarLayout>
  );
};

export default LeaseContainer;
