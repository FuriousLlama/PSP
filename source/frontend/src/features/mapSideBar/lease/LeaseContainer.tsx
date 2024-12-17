import React, { useCallback, useContext, useEffect } from 'react';

import LeaseIcon from '@/assets/images/lease-icon.svg?react';
import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';
import { useLeaseStakeholderRepository } from '@/hooks/repositories/useLeaseStakeholderRepository';

import { SideBarContext } from '../context/sidebarContext';
import { FileView } from '../shared/fileBody/fileView';
import LeaseHeader from './common/LeaseHeader';
import LeaseBodyContainer from './LeaseBodyContainer';
import leaseEditDetailNavigations from './LeaseEditPages';

export interface ILeaseContainerProps {
  leaseId: number;
  onClose?: () => void;
}

export const LeaseContainer: React.FC<ILeaseContainerProps> = ({ leaseId, onClose }) => {
  const close = useCallback(() => onClose && onClose(), [onClose]);
  const { setFileComponents, staleFile, setLastUpdatedBy, staleLastUpdatedBy, lastUpdatedBy } =
    useContext(SideBarContext);

  const {
    getLease: { execute: getLease, loading: getLeaseLoading },
    getLeaseRenewals: { execute: getRenewals, loading: getLeaseRenewalsLoading },

    getLastUpdatedBy: { execute: getLastUpdatedBy, loading: getLastUpdatedByLoading },
  } = useLeaseRepository();

  const {
    getLeaseStakeholders: { execute: getStakeholders, loading: getLeaseStakeholdersLoading },
  } = useLeaseStakeholderRepository();

  const onSuccess = useCallback(() => {
    console.log('suceesss');
  }, []);

  setFileComponents('lease', {
    defaultFileTab: 'sdfsf',
    propertyTabs: [],
    defaultPropertyTab: 'sometihg',

    editNavComponents: leaseEditDetailNavigations,
    fileBodyContainer: LeaseBodyContainer,
  });

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

  return (
    <FileView
      title={'Lease / Licence'}
      icon={
        <LeaseIcon
          title="Lease file icon"
          width="2.6rem"
          height="2.6rem"
          fill="currentColor"
          className="mr-2"
        />
      }
      header={<LeaseHeader leaseId={leaseId} />}
    />
  );
};

export default LeaseContainer;
