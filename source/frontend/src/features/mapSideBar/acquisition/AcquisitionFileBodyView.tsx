import React from 'react';

import FileLayout from '@/features/mapSideBar/layout/FileLayout';
import { ApiGen_Concepts_AcquisitionFile } from '@/models/api/generated/ApiGen_Concepts_AcquisitionFile';

import FileMenu from '../shared/fileMenu/fileMenuView';
import { StyledFormWrapper } from '../shared/styles';
import AcquisitionTabRouter from './router/AcquisitionTabRouter';

export interface IAcquisitionFileBodyViewProps {
  acquisitionFile: ApiGen_Concepts_AcquisitionFile;
  onSelectFileSummary: () => void;
  onSelectProperty: (propertyId: number) => void;
  onEditProperties: () => void;
}

export const AcquisitionFileBodyView: React.FunctionComponent<IAcquisitionFileBodyViewProps> = ({
  acquisitionFile,
  onSelectFileSummary,
  onSelectProperty,
  onEditProperties,
}) => {
  return (
    <FileLayout
      leftComponent={
        <FileMenu
          properties={acquisitionFile.fileProperties}
          canEdit={true}
          onSelectFileSummary={onSelectFileSummary}
          onSelectProperty={onSelectProperty}
          onEditProperties={onEditProperties}
        />
      }
      bodyComponent={
        <StyledFormWrapper>
          <AcquisitionTabRouter
            acquisitionFile={acquisitionFile}
            properties={acquisitionFile.fileProperties}
          />
        </StyledFormWrapper>
      }
    ></FileLayout>
  );
};
