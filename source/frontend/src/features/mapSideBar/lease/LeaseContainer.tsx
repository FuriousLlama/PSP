import React, { useCallback, useContext, useEffect, useMemo } from 'react';

import LeaseIcon from '@/assets/images/lease-icon.svg?react';
import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';
import { usePropertyLeaseRepository } from '@/hooks/repositories/usePropertyLeaseRepository';
import { ApiGen_Concepts_Lease } from '@/models/api/generated/ApiGen_Concepts_Lease';
import { exists } from '@/utils';

import { SideBarContext } from '../context/sidebarContext';
import MapSideBarLayout from '../layout/MapSideBarLayout';
import FileBodyRouter from '../shared/router/FileBodyRouter';
import LeaseHeader from './common/LeaseHeader';
import leaseEditDetailNavigations from './LeaseEditPages';
import getLeaseTabs from './tabs/leaseTabs';

export interface ILeaseContainerProps {
  leaseId: number;
  onClose?: () => void;
}

export const LeaseContainer: React.FC<ILeaseContainerProps> = ({ leaseId, onClose }) => {
  const close = useCallback(() => onClose && onClose(), [onClose]);
  const {
    setFileData,
    file,
    staleFile,
    setLastUpdatedBy,
    staleLastUpdatedBy,
    lastUpdatedBy,
    setFileTabs,
  } = useContext(SideBarContext);

  const {
    getLease: { execute: getLease, loading: getLeaseLoading },

    getLastUpdatedBy: { execute: getLastUpdatedBy, loading: getLastUpdatedByLoading },
  } = useLeaseRepository();

  const {
    getPropertyLeases: { execute: getPropertyLeases, loading: propertyLeasesLoading },
  } = usePropertyLeaseRepository();

  const onSuccess = useCallback(() => {
    console.log('suceesss');
  }, []);

  const fetchLease = useCallback(async () => {
    if (leaseId) {
      const getLeasePromise = getLease(leaseId);
      const getPropertiesPromise = getPropertyLeases(leaseId);
      const getLastUpdatedByPromise = getLastUpdatedBy(leaseId);

      const [leaseResponse, propertiesResponse, lastUpdatedBy] = await Promise.all([
        getLeasePromise,
        getPropertiesPromise,
        getLastUpdatedByPromise,
      ]);

      if (exists(leaseResponse) && exists(propertiesResponse)) {
        setFileData('lease', leaseResponse, propertiesResponse);

        setFileTabs(getLeaseTabs(leaseResponse, onSuccess));
      }

      if (exists(lastUpdatedBy)) {
        setLastUpdatedBy(lastUpdatedBy);
      }
    }
  }, [
    leaseId,
    getLease,
    getPropertyLeases,
    getLastUpdatedBy,
    setFileData,
    setFileTabs,
    onSuccess,
    setLastUpdatedBy,
  ]);

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
    if (staleLastUpdatedBy) {
      fetchLastUpdatedBy();
    }
  }, [staleLastUpdatedBy, fetchLastUpdatedBy]);

  useEffect(() => {
    if (staleFile) {
      fetchLease();
    }
  }, [staleFile, fetchLease]);

  // First time load
  useEffect(() => {
    fetchLease();
  }, [fetchLease]);

  const isEditing = false;
  const lease = useMemo(() => file as ApiGen_Concepts_Lease, [file]);

  const editNavComponenents = leaseEditDetailNavigations;

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
      <FileBodyRouter editComponents={editNavComponenents} />
    </MapSideBarLayout>
  );
};

export default LeaseContainer;
