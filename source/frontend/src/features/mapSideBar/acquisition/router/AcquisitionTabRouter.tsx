import React from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';

import { FileTabType } from '@/features/mapSideBar/shared/detail/FileTabs';
import { ApiGen_CodeTypes_FileTypes } from '@/models/api/generated/ApiGen_CodeTypes_FileTypes';
import { ApiGen_Concepts_AcquisitionFile } from '@/models/api/generated/ApiGen_Concepts_AcquisitionFile';
import { ApiGen_Concepts_AcquisitionFileProperty } from '@/models/api/generated/ApiGen_Concepts_AcquisitionFileProperty';
import { exists, stripTrailingSlash } from '@/utils';
import AppRoute from '@/utils/AppRoute';

import { InventoryTabNames, InventoryTabs } from '../../property/InventoryTabs';
import PropertyFileTabContainer from '../../shared/detail/PropertyFileContainer';
import { RouterTabs } from '../../shared/tabs/RouterTabs';
import AcquisitionFileTabs from '../tabs/AcquisitionFileTabs';

export interface IAcquisitionRouterProps {
  acquisitionFile: ApiGen_Concepts_AcquisitionFile;
  properties: ApiGen_Concepts_AcquisitionFileProperty[];
}

export const AcquisitionTabRouter: React.FC<IAcquisitionRouterProps> = props => {
  const { path, url, match } = useRouteMatch();

  if (!exists(props.acquisitionFile)) {
    return null;
  }

  // render edit forms
  return (
    <Switch>
      <AppRoute
        path={`${stripTrailingSlash(path)}/file/:detailType`}
        customRender={({ match }) => (
          <AcquisitionFileTabs acquisitionFileId={Number(match.params.fileId)} View={RouterTabs} />
        )}
        key={'acquisitiontabs'}
        title={'Acquisition Tabs'}
      />

      <AppRoute
        path={`${stripTrailingSlash(path)}/property/:propertyId`}
        customRender={({ match }) => (
          <PropertyFileTabContainer
            fileProperty={props.acquisitionFile.fileProperties.find(
              x => x.propertyId === Number(match.params.propertyId),
            )}
            View={InventoryTabs}
            customTabs={[]}
            defaultTab={InventoryTabNames.property}
            fileType={ApiGen_CodeTypes_FileTypes.Acquisition}
          />
        )}
        key={'acquisitiontabs'}
        title={'Acquisition Property'}
      />
      <Redirect
        from={`${stripTrailingSlash(path)}/file/`}
        to={`${stripTrailingSlash(url)}/file/${FileTabType.FILE_DETAILS}`}
      />
    </Switch>
  );
};

export default AcquisitionTabRouter;
