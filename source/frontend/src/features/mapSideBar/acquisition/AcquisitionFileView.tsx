import React from 'react';

import AcquisitionFileIcon from '@/assets/images/acquisition-icon.svg?react';
import MapSideBarLayout from '@/features/mapSideBar/layout/MapSideBarLayout';
import { Api_LastUpdatedBy } from '@/models/api/File';
import { ApiGen_Concepts_AcquisitionFile } from '@/models/api/generated/ApiGen_Concepts_AcquisitionFile';

import AcquisitionHeader from './common/AcquisitionHeader';
import AcquisitionBodyRouter from './router/AcquisitionBodyRouter';

export interface IAcquisitionFileViewProps {
  acquisitionFile: ApiGen_Concepts_AcquisitionFile;
  lastUpdatedBy: Api_LastUpdatedBy;
  onClose: (() => void) | undefined;
  formTitle: string;
}

export const AcquisitionFileView: React.FunctionComponent<IAcquisitionFileViewProps> = ({
  acquisitionFile,
  formTitle,
  lastUpdatedBy,
  onClose,
}) => {
  return (
    <MapSideBarLayout
      showCloseButton
      onClose={onClose}
      title={formTitle}
      icon={
        <AcquisitionFileIcon
          title="Acquisition file Icon"
          width="2.8rem"
          height="2.8rem"
          fill="currentColor"
        />
      }
      header={<AcquisitionHeader acquisitionFile={acquisitionFile} lastUpdatedBy={lastUpdatedBy} />}
    >
      <AcquisitionBodyRouter />
    </MapSideBarLayout>
  );
};

export default AcquisitionFileView;
