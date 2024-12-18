import React, { useCallback, useContext, useEffect, useState } from 'react';

import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';
import { usePropertyLeaseRepository } from '@/hooks/repositories/usePropertyLeaseRepository';
import { ApiGen_CodeTypes_FileTypes } from '@/models/api/generated/ApiGen_CodeTypes_FileTypes';
import { exists, isValidId } from '@/utils';

import GenerateFormView from '../acquisition/common/GenerateForm/GenerateFormView';
import { SideBarContext } from '../context/sidebarContext';
import { IFileBodyViewProps } from '../shared/fileBody/fileBodyView';
import usePathResolver from '../shared/sidebarPathSolver';
import { TabContent, TabRouteType } from '../shared/tabs/RouterTabs';
import LeaseGenerateFormContainer from './LeaseGenerateFormContainer';
import { LeasePropertyContainer } from './tabs/leasePropertyContainer';
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

  const [fileTabs, setFileTabs] = useState<TabContent[]>([]);

  const fileType = ApiGen_CodeTypes_FileTypes.Lease;

  const { fileProperties, setFileProperties } = useContext(SideBarContext);

  const {
    getLease: { execute: getLease, loading: getLeaseLoading },
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
  }, [fileId, getLease, getProperties, setFileProperties]);

  useEffect(() => {
    fetchLease();
  }, [fetchLease]);

  const onSelectFileSummary = () => {
    pathResolver.showFile(fileType, fileId);
  };

  const onSelectProperty = useCallback(
    (filePropertyId: number) => {
      pathResolver.showFileProperty(fileType, fileId, filePropertyId);
    },
    [fileId, fileType, pathResolver],
  );

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

  const onTabSelect = (eventKey: string | null) => {
    const tab = Object.values(fileTabs).find(tab => tab.key === eventKey);
    pathResolver.showDetail('lease', fileId, tab.key, false);
  };

  return (
    <View
      fileProperties={fileProperties}
      onSelectFileSummary={onSelectFileSummary}
      onSelectProperty={onSelectProperty}
      onEditProperties={onEditProperties}
      canEdit={true}
      fileType={fileType}
      fileTabs={fileTabs}
      FileFormContainer={fileGenerateContainer}
      defaultFileTabKey={TabRouteType.FILE_DETAILS}
      filePropertyContainer={LeasePropertyContainer}
      onTabSelect={onTabSelect}
    />
  );
};

export default LeaseBodyContainer;
