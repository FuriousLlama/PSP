import React, { useCallback, useContext, useEffect, useMemo } from 'react';

import LeaseIcon from '@/assets/images/lease-icon.svg?react';
import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';
import { useLeaseStakeholderRepository } from '@/hooks/repositories/useLeaseStakeholderRepository';
import { usePropertyLeaseRepository } from '@/hooks/repositories/usePropertyLeaseRepository';
import { ApiGen_Concepts_Lease } from '@/models/api/generated/ApiGen_Concepts_Lease';
import { exists } from '@/utils';

import GenerateFormView from '../acquisition/common/GenerateForm/GenerateFormView';
import { SideBarContext } from '../context/sidebarContext';
import MapSideBarLayout from '../layout/MapSideBarLayout';
import FileBodyRouter from '../shared/router/FileBodyRouter';
import LeaseHeader from './common/LeaseHeader';
import leaseEditDetailNavigations from './LeaseEditPages';
import LeaseGenerateFormContainer from './LeaseGenerateFormContainer';
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
    setFileGenerateContainer,
  } = useContext(SideBarContext);

  const {
    getLease: { execute: getLease, loading: getLeaseLoading },
    getLeaseRenewals: { execute: getRenewals, loading: getLeaseRenewalsLoading },

    getLastUpdatedBy: { execute: getLastUpdatedBy, loading: getLastUpdatedByLoading },
  } = useLeaseRepository();

  const {
    getPropertyLeases: { execute: getProperties, loading: propertyLeasesLoading },
  } = usePropertyLeaseRepository();

  const {
    getLeaseStakeholders: { execute: getStakeholders, loading: getLeaseStakeholdersLoading },
  } = useLeaseStakeholderRepository();

  const onSuccess = useCallback(() => {
    console.log('suceesss');
  }, []);

  const fetchLease = useCallback(async () => {
    if (leaseId) {
      const getLeasePromise = getLease(leaseId);
      const getRenewalsPromise = getRenewals(leaseId);
      const getPropertiesPromise = getProperties(leaseId);
      const getLeaseStakeholders = getStakeholders(leaseId);
      const getLastUpdatedByPromise = getLastUpdatedBy(leaseId);

      const [
        leaseResponse,
        renewalsResponse,
        propertiesResponse,
        stakeholdersResponse,
        lastUpdatedBy,
      ] = await Promise.all([
        getLeasePromise,
        getRenewalsPromise,
        getPropertiesPromise,
        getLeaseStakeholders,
        getLastUpdatedByPromise,
      ]);

      if (exists(leaseResponse) && exists(propertiesResponse)) {
        leaseResponse.renewals = renewalsResponse;
        leaseResponse.fileProperties = propertiesResponse;
        leaseResponse.stakeholders = stakeholdersResponse;

        setFileData('lease', leaseResponse, propertiesResponse);

        setFileTabs(getLeaseTabs(leaseResponse, onSuccess));

        const leaseTypeCode = exists(leaseResponse.leaseType?.id)
          ? leaseResponse.leaseType?.id
          : null;

        setFileGenerateContainer(
          <LeaseGenerateFormContainer
            leaseId={leaseId}
            leaseType={leaseTypeCode}
            View={GenerateFormView}
          />,
        );
      }

      if (exists(lastUpdatedBy)) {
        setLastUpdatedBy(lastUpdatedBy);
      }
    }
  }, [
    getLastUpdatedBy,
    getLease,
    getProperties,
    getRenewals,
    getStakeholders,
    leaseId,
    onSuccess,
    setFileData,
    setFileGenerateContainer,
    setFileTabs,
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
