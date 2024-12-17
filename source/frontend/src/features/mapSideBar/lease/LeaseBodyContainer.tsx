import React, { useCallback, useContext, useEffect, useState } from 'react';

import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';
import { usePropertyLeaseRepository } from '@/hooks/repositories/usePropertyLeaseRepository';
import { ApiGen_CodeTypes_FileTypes } from '@/models/api/generated/ApiGen_CodeTypes_FileTypes';
import { ApiGen_Concepts_FileProperty } from '@/models/api/generated/ApiGen_Concepts_FileProperty';
import { exists, isValidId } from '@/utils';

import GenerateFormView from '../acquisition/common/GenerateForm/GenerateFormView';
import { SideBarContext } from '../context/sidebarContext';
import { IFileBodyViewProps } from '../shared/fileBody/fileBodyView';
import usePathResolver from '../shared/sidebarPathSolver';
import { TabContent } from '../shared/tabs/RouterTabs';
import LeaseGenerateFormContainer from './LeaseGenerateFormContainer';
import getLeaseTabs from './tabs/leaseTabs';

export interface IFileBodyContainer {
  fileId: number;
  View: React.FunctionComponent<React.PropsWithChildren<IFileBodyViewProps>>;
}

export const LeaseBodyContainer: React.FunctionComponent<IFileBodyContainer> = ({
  fileId,
  View,
}) => {
  const pathResolver = usePathResolver();

  const [fileProperties, setFileProperties] = useState<ApiGen_Concepts_FileProperty[]>([]);
  const [fileTabs, setFileTabs] = useState<TabContent[]>([]);

  const { fileType } = useContext(SideBarContext);

  const {
    getLease: { execute: getLease, loading: getLeaseLoading },
    getLeaseRenewals: { execute: getRenewals, loading: getLeaseRenewalsLoading },

    getLastUpdatedBy: { execute: getLastUpdatedBy, loading: getLastUpdatedByLoading },
  } = useLeaseRepository();

  const {
    getPropertyLeases: { execute: getProperties },
  } = usePropertyLeaseRepository();

  const onSuccess = () => {
    console.log('asdfasd');
  };

  const fetchLease = useCallback(async () => {
    if (isValidId(fileId)) {
      const lease = await getLease(fileId);
      const retrieved = await getProperties(fileId);
      if (exists(retrieved)) {
        setFileProperties(retrieved);
        setFileTabs(getLeaseTabs(lease, onSuccess));
      }
    }
  }, [fileId, getLease, getProperties]);

  useEffect(() => {
    fetchLease();
  }, [fetchLease]);

  const onSelectFileSummary = () => {
    pathResolver.showFile(fileType, fileId);
  };

  const onSelectProperty = (propertyId: number) => {
    pathResolver.showPropertyTabs(fileType, fileId, propertyId);
  };

  const onEditProperties = () => {
    pathResolver.editProperties(fileType, fileId);
  };

  // UI components
  if (!exists(fileProperties)) {
    return <></>;
  }

  const fileGenerateContainer = (
    <LeaseGenerateFormContainer leaseId={fileId} leaseType={null} View={GenerateFormView} />
  );
  return (
    <View
      fileProperties={fileProperties}
      onSelectFileSummary={onSelectFileSummary}
      onSelectProperty={onSelectProperty}
      onEditProperties={onEditProperties}
      canEdit={true}
      fileType={ApiGen_CodeTypes_FileTypes.Lease}
      fileTabs={fileTabs}
      FileFormContainer={fileGenerateContainer}
    />
  );
};

export default LeaseBodyContainer;
