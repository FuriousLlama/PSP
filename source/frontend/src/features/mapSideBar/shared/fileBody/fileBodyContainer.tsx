import React, { useContext } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { ApiGen_CodeTypes_FileTypes } from '@/models/api/generated/ApiGen_CodeTypes_FileTypes';
import { exists, stripTrailingSlash } from '@/utils';

import { SideBarContext } from '../../context/sidebarContext';
import usePathResolver from '../sidebarPathSolver';
import { IFileBodyViewProps } from './fileBodyView';

export interface IFileBodyContainerProps {
  fileId: number;
  View: React.FunctionComponent<React.PropsWithChildren<IFileBodyViewProps>>;
}

export const FileBodyContainer: React.FunctionComponent<IFileBodyContainerProps> = ({
  fileId,
  View,
}) => {
  const history = useHistory();
  const match = useRouteMatch();

  const pathResolver = usePathResolver();

  const { fileType, fileProperties, fileTabs } = useContext(SideBarContext);

  const onSelectFileSummary = () => {
    history.push(`${stripTrailingSlash(match.url)}/file`);
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

  return (
    <View
      fileProperties={fileProperties}
      onSelectFileSummary={onSelectFileSummary}
      onSelectProperty={onSelectProperty}
      onEditProperties={onEditProperties}
      canEdit={true}
      fileType={ApiGen_CodeTypes_FileTypes.Lease}
      fileTabs={fileTabs}
    />
  );
};

export default FileBodyContainer;
