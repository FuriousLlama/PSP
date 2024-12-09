import React from 'react';

import { ApiGen_CodeTypes_FileTypes } from '@/models/api/generated/ApiGen_CodeTypes_FileTypes';
import { ApiGen_Concepts_FileProperty } from '@/models/api/generated/ApiGen_Concepts_FileProperty';
import { exists } from '@/utils';

import FileLayout from '../../layout/FileLayout';
import { TabContent, TabRouteType } from '../../shared/tabs/RouterTabs';
import FileBodyTabRouter from '../router/FileBodyTabRouter';
import { StyledFormWrapper } from '../styles';
import FileMenu from './fileMenuView';

export interface IFileBodyViewProps {
  fileProperties: ApiGen_Concepts_FileProperty[];
  canEdit: boolean;
  fileType: ApiGen_CodeTypes_FileTypes;
  fileTabs: TabContent[];
  FileFormContainer: React.ReactNode | null;
  onSelectFileSummary: () => void;
  onSelectProperty: (propertyId: number) => void;
  onEditProperties: () => void;
}

export const FileBodyView: React.FunctionComponent<IFileBodyViewProps> = ({
  fileProperties,
  canEdit,
  fileType,
  fileTabs,
  onSelectFileSummary,
  onSelectProperty,
  onEditProperties,
  FileFormContainer,
}) => {
  return (
    <FileLayout
      leftComponent={
        <FileMenu
          properties={fileProperties}
          canEdit={canEdit}
          onSelectFileSummary={onSelectFileSummary}
          onSelectProperty={onSelectProperty}
          onEditProperties={onEditProperties}
        >
          {exists(FileFormContainer) && FileFormContainer}
        </FileMenu>
      }
      bodyComponent={
        <StyledFormWrapper>
          <FileBodyTabRouter
            defaultFileTabKey={TabRouteType.FILE_DETAILS}
            fileTabs={fileTabs}
            fileProperty={undefined}
            fileType={fileType}
          />
        </StyledFormWrapper>
      }
    ></FileLayout>
  );
};
