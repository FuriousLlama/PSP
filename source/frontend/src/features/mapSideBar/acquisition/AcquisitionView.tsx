import { AxiosError } from 'axios';
import { FormikProps } from 'formik/dist/types';
import React, { useContext } from 'react';
import {
  match,
  matchPath,
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';

import AcquisitionFileIcon from '@/assets/images/acquisition-icon.svg?react';
import { Claims } from '@/constants';
import FileLayout from '@/features/mapSideBar/layout/FileLayout';
import MapSideBarLayout from '@/features/mapSideBar/layout/MapSideBarLayout';
import useKeycloakWrapper from '@/hooks/useKeycloakWrapper';
import { IApiError } from '@/interfaces/IApiError';
import { ApiGen_CodeTypes_FileTypes } from '@/models/api/generated/ApiGen_CodeTypes_FileTypes';
import { ApiGen_Concepts_AcquisitionFile } from '@/models/api/generated/ApiGen_Concepts_AcquisitionFile';
import { ApiGen_Concepts_File } from '@/models/api/generated/ApiGen_Concepts_File';
import { stripTrailingSlash } from '@/utils';

import { SideBarContext } from '../context/sidebarContext';
import { InventoryTabNames } from '../property/InventoryTabs';
import FilePropertyRouter from '../router/FilePropertyRouter';
import { FileTabType } from '../shared/detail/FileTabs';
import FileMenuView from '../shared/FileMenuView';
import { PropertyForm } from '../shared/models';
import SidebarFooter from '../shared/SidebarFooter';
import { StyledFormWrapper } from '../shared/styles';
import UpdateProperties from '../shared/update/properties/UpdateProperties';
import { useFilePropertyIdFromUrl } from '../shared/usePropertyIndexFromUrl';
import { AcquisitionContainerState } from './AcquisitionContainer';
import { isAcquisitionFile } from './add/models';
import AcquisitionHeader from './common/AcquisitionHeader';
import GenerateFormContainer from './common/GenerateForm/GenerateFormContainer';
import GenerateFormView from './common/GenerateForm/GenerateFormView';
import { AcquisitionRouter } from './router/AcquisitionRouter';
import AcquisitionFileStatusUpdateSolver from './tabs/fileDetails/detail/AcquisitionFileStatusUpdateSolver';

export interface IAcquisitionViewProps {
  onClose: (() => void) | undefined;
  onSave: () => Promise<void>;
  onCancel: () => void;
  onSelectFileSummary: () => void;
  onSelectProperty: (propertyId: number) => void;
  onEditProperties: () => void;
  onSuccess: () => void;
  onUpdateProperties: (file: ApiGen_Concepts_File) => Promise<ApiGen_Concepts_File | undefined>;
  confirmBeforeAdd: (propertyForm: PropertyForm) => Promise<boolean>;
  canRemove: (propertyId: number) => Promise<boolean>;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  containerState: AcquisitionContainerState;
  setContainerState: React.Dispatch<Partial<AcquisitionContainerState>>;
  formikRef: React.RefObject<FormikProps<any>>;
  isFormValid: boolean;
  error: AxiosError<IApiError, any> | undefined;
}

export const AcquisitionView: React.FunctionComponent<IAcquisitionViewProps> = ({
  onClose,
  onSave,
  onCancel,
  onSelectFileSummary,
  onSelectProperty,
  onEditProperties,
  onSuccess,
  onUpdateProperties,
  confirmBeforeAdd,
  canRemove,
  isEditing,
  setIsEditing,
  containerState,
  formikRef,
  isFormValid,
  error,
}) => {
  // match for the current route
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();
  const { hasClaim } = useKeycloakWrapper();
  const { file, lastUpdatedBy } = useContext(SideBarContext);
  const acquisitionFile: ApiGen_Concepts_AcquisitionFile = {
    ...file,
  } as unknown as ApiGen_Concepts_AcquisitionFile;

  // match for property menu routes - eg /property/1/ltsa
  const fileMatch = matchPath<Record<string, string>>(location.pathname, `${match.path}/:tab`);
  const propertySelectorMatch = matchPath<Record<string, string>>(
    location.pathname,
    `${stripTrailingSlash(match.path)}/property/selector`,
  );
  const propertiesMatch = matchPath<Record<string, string>>(
    location.pathname,
    `${stripTrailingSlash(match.path)}/property/:menuIndex/:tab`,
  );

  const formTitle = isEditing
    ? getEditTitle(fileMatch, propertySelectorMatch, propertiesMatch)
    : 'Acquisition File';

  const closePropertySelector = () => {
    setIsEditing(false);
    history.push(`${match.url}`);
  };

  // Extract the zero-based property index from the current URL path.
  // It will be null if route is not matched
  const currentFilePropertyId: number | null = useFilePropertyIdFromUrl();
  const statusSolver = new AcquisitionFileStatusUpdateSolver(acquisitionFile.fileStatusTypeCode);

  return (
    <Switch>
      <Route path={`${stripTrailingSlash(match.path)}/property/selector`}>
        {file && (
          <UpdateProperties
            file={file}
            setIsShowingPropertySelector={closePropertySelector}
            onSuccess={onSuccess}
            updateFileProperties={onUpdateProperties}
            confirmBeforeAdd={confirmBeforeAdd}
            confirmBeforeAddMessage={
              <>
                <p>This property has already been added to one or more acquisition files.</p>
                <p>Do you want to acknowledge and proceed?</p>
              </>
            }
            canRemove={canRemove}
            formikRef={formikRef}
          />
        )}
      </Route>
      <Route>
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
          header={
            <AcquisitionHeader acquisitionFile={acquisitionFile} lastUpdatedBy={lastUpdatedBy} />
          }
          footer={
            isEditing && (
              <SidebarFooter
                isOkDisabled={formikRef?.current?.isSubmitting}
                onSave={onSave}
                onCancel={onCancel}
                displayRequiredFieldError={isFormValid === false}
              />
            )
          }
        >
          <FileLayout
            leftComponent={
              <>
                {isAcquisitionFile(file) && (
                  <FileMenuView
                    file={file}
                    currentFilePropertyId={currentFilePropertyId}
                    canEdit={hasClaim(Claims.ACQUISITION_EDIT)}
                    isInNonEditableState={!statusSolver.canEditProperties()}
                    onSelectFileSummary={onSelectFileSummary}
                    onSelectProperty={onSelectProperty}
                    onEditProperties={onEditProperties}
                  >
                    <GenerateFormContainer acquisitionFileId={file.id} View={GenerateFormView} />
                  </FileMenuView>
                )}
              </>
            }
            bodyComponent={
              <StyledFormWrapper>
                {error && (
                  <b>
                    Failed to load Acquisition File. Check the detailed error in the top right for
                    more details.
                  </b>
                )}
                <AcquisitionRouter
                  formikRef={formikRef}
                  acquisitionFile={acquisitionFile}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  defaultFileTab={containerState.defaultFileTab}
                  defaultPropertyTab={containerState.defaultPropertyTab}
                  onSuccess={onSuccess}
                />
                <Route
                  path={`${stripTrailingSlash(match.path)}/property/:filePropertyId`}
                  render={({ match }) => (
                    <FilePropertyRouter
                      formikRef={formikRef}
                      selectedFilePropertyId={Number(match.params.filePropertyId)}
                      file={acquisitionFile}
                      fileType={ApiGen_CodeTypes_FileTypes.Acquisition}
                      isEditing={isEditing}
                      setIsEditing={setIsEditing}
                      defaultPropertyTab={containerState.defaultPropertyTab}
                      onSuccess={onSuccess}
                    />
                  )}
                />
              </StyledFormWrapper>
            }
          ></FileLayout>
        </MapSideBarLayout>
      </Route>
    </Switch>
  );
};

// Set header title based on current tab route
const getEditTitle = (
  fileMatch: match<Record<string, string>> | null,
  propertySelectorMatch: match<Record<string, string>> | null,
  propertiesMatch: match<Record<string, string>> | null,
) => {
  if (fileMatch !== null) {
    const fileTab = fileMatch.params.tab;
    switch (fileTab) {
      case FileTabType.FILE_DETAILS:
        return 'Update Acquisition File';
      case FileTabType.CHECKLIST:
        return 'Update Checklist';
      case FileTabType.AGREEMENTS:
        return 'Update Agreements';
      case FileTabType.STAKEHOLDERS:
        return 'Update Stakeholders';
    }
  }

  if (propertySelectorMatch !== null) {
    return 'Update Acquisition Properties';
  }

  if (propertiesMatch !== null) {
    const propertyTab = propertiesMatch.params.tab;
    switch (propertyTab) {
      case InventoryTabNames.property:
        return 'Update Property File Data';
      case InventoryTabNames.takes:
        return 'Update Takes';
    }
  }

  return 'Acquisition File';
};

export default AcquisitionView;
