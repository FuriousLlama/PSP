import React from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';

import { FileTabType } from '@/features/mapSideBar/shared/detail/FileTabs';
import { ApiGen_CodeTypes_FileTypes } from '@/models/api/generated/ApiGen_CodeTypes_FileTypes';
import { ApiGen_Concepts_FileProperty } from '@/models/api/generated/ApiGen_Concepts_FileProperty';
import { stripTrailingSlash } from '@/utils';
import AppRoute from '@/utils/AppRoute';

import { InventoryTabNames, InventoryTabs } from '../../property/InventoryTabs';
import PropertyFileTabContainer from '../../shared/detail/PropertyFileContainer';
import { RouterTabs, TabContent, TabRouteType } from '../../shared/tabs/RouterTabs';

export interface IFileBodyTabRouterProps {
  defaultFileTabKey: TabRouteType;
  fileTabs: TabContent[];
  fileProperty: ApiGen_Concepts_FileProperty | null;
  fileType: ApiGen_CodeTypes_FileTypes | null;
}

export const FileBodyTabTabRouter: React.FC<IFileBodyTabRouterProps> = props => {
  const { path, url } = useRouteMatch();

  // render edit forms
  return (
    <Switch>
      <AppRoute
        path={`${stripTrailingSlash(path)}/file/:detailType`}
        customRender={() => (
          <RouterTabs defaultTabKey={props.defaultFileTabKey} tabs={props.fileTabs} />
        )}
        key={'acquisitiontabs'}
        title={'FileBodyTab Tabs'}
      />

      <AppRoute
        path={`${stripTrailingSlash(path)}/property/:filePropertyId`}
        customRender={({ match }) => (
          <PropertyFileTabContainer
            filePropertyId={Number(match.params.filePropertyId)}
            View={InventoryTabs}
            customTabs={[]}
            defaultTab={InventoryTabNames.property}
            fileType={props.fileType}
          />
        )}
        key={'acquisitiontabs'}
        title={'FileBodyTab Property'}
      />
      <Redirect
        from={`${stripTrailingSlash(path)}/file/`}
        to={`${stripTrailingSlash(url)}/file/${FileTabType.FILE_DETAILS}`}
      />
      <Redirect
        from={`${stripTrailingSlash(path)}`}
        to={`${stripTrailingSlash(url)}/file/${FileTabType.FILE_DETAILS}`}
      />
    </Switch>
  );
};

export default FileBodyTabTabRouter;
