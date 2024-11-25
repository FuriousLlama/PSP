import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { useMapStateMachine } from '@/components/common/mapFSM/MapStateMachineContext';
import { EnumAcquisitionFileType } from '@/constants/acquisitionFileType';
import * as API from '@/constants/API';
import { Claims } from '@/constants/claims';
import { NoteTypes } from '@/constants/noteTypes';
import NoteListView from '@/features/notes/list/NoteListView';
import { useAcquisitionProvider } from '@/hooks/repositories/useAcquisitionProvider';
import useKeycloakWrapper from '@/hooks/useKeycloakWrapper';
import { ApiGen_CodeTypes_DocumentRelationType } from '@/models/api/generated/ApiGen_CodeTypes_DocumentRelationType';
import { ApiGen_CodeTypes_FileTypes } from '@/models/api/generated/ApiGen_CodeTypes_FileTypes';
import { ApiGen_Concepts_AcquisitionFile } from '@/models/api/generated/ApiGen_Concepts_AcquisitionFile';
import { exists } from '@/utils';

import CompensationListContainer from '../../compensation/list/CompensationListContainer';
import CompensationListView from '../../compensation/list/CompensationListView';
import { SideBarContext } from '../../context/sidebarContext';
import usePathResolver from '../../shared/sidebarPathSolver';
import { ChecklistView } from '../../shared/tabs/checklist/detail/ChecklistView';
import DocumentsTab from '../../shared/tabs/DocumentsTab';
import { IRouterTabsProps, TabContent, TabRouteType } from '../../shared/tabs/RouterTabs';
import AgreementContainer from './agreement/detail/AgreementContainer';
import AgreementView from './agreement/detail/AgreementView';
import ExpropriationTabContainer from './expropriation/ExpropriationTabContainer';
import ExpropriationTabContainerView from './expropriation/ExpropriationTabContainerView';
import AcquisitionSummaryView from './fileDetails/detail/AcquisitionSummaryView';
import StakeHolderContainer from './stakeholders/detail/StakeHolderContainer';
import StakeHolderView from './stakeholders/detail/StakeHolderView';
import SubFileListContainer from './subFiles/SubFileListContainer';
import SubFileListView from './subFiles/SubFileListView';

export interface IAcquisitionFileTabsProps {
  acquisitionFileId: number;
  View: React.FunctionComponent<React.PropsWithChildren<IRouterTabsProps>>;
}

export const AcquisitionFileTabs: React.FC<IAcquisitionFileTabsProps> = ({
  acquisitionFileId,
  View,
}) => {
  const [acquisitionFile, setAcquisitionFile] = useState<ApiGen_Concepts_AcquisitionFile>(null);

  const { hasClaim } = useKeycloakWrapper();
  const { setFullWidthSideBar } = useMapStateMachine();

  const { setStaleLastUpdatedBy } = useContext(SideBarContext);

  const {
    getAcquisitionFile: { execute: getAcquisitionFile },
  } = useAcquisitionProvider();

  const pathResolver = usePathResolver();

  const fetchAcquisitionFile = useCallback(async () => {
    const file = await getAcquisitionFile(acquisitionFileId);
    if (exists(file)) {
      setAcquisitionFile(file);
    } else {
      setAcquisitionFile(null);
    }
  }, [acquisitionFileId, getAcquisitionFile]);

  useEffect(() => {
    fetchAcquisitionFile();
  }, [fetchAcquisitionFile]);

  const onChildSuccess = () => {
    setStaleLastUpdatedBy(true);
  };

  const setIsEditing = (sadfsd: boolean) => {
    console.log('iseditign');
  };

  const match = useRouteMatch();
  const detailType = match.params['detailType'];

  useEffect(() => {
    if (detailType === TabRouteType.NOTES || detailType === TabRouteType.DOCUMENTS) {
      setFullWidthSideBar(true);
    } else {
      setFullWidthSideBar(false);
    }
    return () => setFullWidthSideBar(false);
  }, [detailType, setFullWidthSideBar]);

  const defaultTab = TabRouteType.FILE_DETAILS;
  const tabViews: TabContent[] = [];

  if (acquisitionFile?.id) {
    tabViews.push({
      content: (
        <AcquisitionSummaryView
          acquisitionFile={acquisitionFile}
          onEdit={() => {
            pathResolver.editDetail('acquisition', acquisitionFileId, TabRouteType.FILE_DETAILS);
          }}
        />
      ),
      key: TabRouteType.FILE_DETAILS,
      name: 'File details',
      detailId: acquisitionFileId,
    });
  }

  if (acquisitionFile?.id) {
    tabViews.push({
      content: (
        <ChecklistView
          apiFile={acquisitionFile}
          showEditButton={true}
          onEdit={() => setIsEditing(true)}
          sectionTypeName={API.ACQUISITION_CHECKLIST_SECTION_TYPES}
          editClaim={Claims.ACQUISITION_EDIT}
          prefix="acq"
        />
      ),
      key: TabRouteType.CHECKLIST,
      name: 'Checklist',
      detailId: acquisitionFileId,
    });
  }

  if (acquisitionFile?.id && hasClaim(Claims.AGREEMENT_VIEW)) {
    tabViews.push({
      content: <AgreementContainer acquisitionFileId={acquisitionFileId} View={AgreementView} />,
      key: TabRouteType.AGREEMENTS,
      name: 'Agreements',
      detailId: acquisitionFileId,
    });
  }

  if (acquisitionFile?.id) {
    tabViews.push({
      content: (
        <StakeHolderContainer
          View={StakeHolderView}
          onEdit={() => setIsEditing(true)}
          acquisitionFile={acquisitionFile}
        />
      ),
      key: TabRouteType.STAKEHOLDERS,
      name: 'Stakeholders',
      detailId: acquisitionFileId,
    });
  }

  if (
    acquisitionFile?.id &&
    (acquisitionFile.acquisitionTypeCode?.id === EnumAcquisitionFileType.SECTN3 ||
      acquisitionFile.acquisitionTypeCode?.id === EnumAcquisitionFileType.SECTN6)
  ) {
    tabViews.push({
      content: (
        <ExpropriationTabContainer
          acquisitionFile={acquisitionFile}
          View={ExpropriationTabContainerView}
        />
      ),
      key: TabRouteType.EXPROPRIATION,
      name: 'Expropriation',
      detailId: acquisitionFileId,
    });
  }

  if (acquisitionFile?.id && hasClaim(Claims.COMPENSATION_REQUISITION_VIEW)) {
    tabViews.push({
      content: (
        <CompensationListContainer
          fileType={ApiGen_CodeTypes_FileTypes.Acquisition}
          file={acquisitionFile}
          View={CompensationListView}
        />
      ),
      key: TabRouteType.COMPENSATIONS,
      name: 'Compensation',
      detailId: acquisitionFileId,
    });
  }

  if (exists(acquisitionFile?.id)) {
    tabViews.push({
      content: <SubFileListContainer acquisitionFile={acquisitionFile} View={SubFileListView} />,
      key: TabRouteType.SUB_FILES,
      name: 'Sub-Files',
      detailId: acquisitionFileId,
    });
  }

  if (acquisitionFile?.id && hasClaim(Claims.DOCUMENT_VIEW)) {
    tabViews.push({
      content: (
        <DocumentsTab
          fileId={acquisitionFile.id}
          relationshipType={ApiGen_CodeTypes_DocumentRelationType.AcquisitionFiles}
          onSuccess={onChildSuccess}
        />
      ),
      key: TabRouteType.DOCUMENTS,
      name: 'Documents',
      detailId: acquisitionFileId,
    });
  }

  if (acquisitionFile?.id && hasClaim(Claims.NOTE_VIEW)) {
    tabViews.push({
      content: (
        <NoteListView
          type={NoteTypes.Acquisition_File}
          entityId={acquisitionFileId}
          onSuccess={onChildSuccess}
        />
      ),
      key: TabRouteType.NOTES,
      name: 'Notes',
      detailId: acquisitionFileId,
    });
  }

  return <View tabs={tabViews} defaultTabKey={defaultTab} />;
};

export default AcquisitionFileTabs;
