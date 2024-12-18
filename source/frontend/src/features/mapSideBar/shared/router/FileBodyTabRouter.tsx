import React from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';

import { FileTabType } from '@/features/mapSideBar/shared/detail/FileTabs';
import { ApiGen_CodeTypes_FileTypes } from '@/models/api/generated/ApiGen_CodeTypes_FileTypes';
import { stripTrailingSlash } from '@/utils';
import AppRoute from '@/utils/AppRoute';

import { IFilePropertyContainer } from '../../lease/tabs/leasePropertyContainer';
import { RouterTabs, TabContent, TabRouteType } from '../../shared/tabs/RouterTabs';

export interface IFileBodyTabRouterProps {
  defaultFileTabKey: TabRouteType;
  fileTabs: TabContent[];
  filePropertyContainer: React.FunctionComponent<IFilePropertyContainer>;
  fileType: ApiGen_CodeTypes_FileTypes | null;
  onTabSelect: (tabName: string | null) => void;
}

export const FileBodyTabTabRouter: React.FC<IFileBodyTabRouterProps> = props => {
  const { path, url } = useRouteMatch();

  const FilePropertyContainer = props.filePropertyContainer;

  return (
    <Switch>
      <AppRoute
        path={`${stripTrailingSlash(path)}/file/:detailType`}
        customRender={() => (
          <RouterTabs
            defaultTabKey={props.defaultFileTabKey}
            tabs={props.fileTabs}
            onTabSelect={props.onTabSelect}
          />
        )}
        key={'file_information'}
        title={'File Information'}
      />

      <AppRoute
        path={`${stripTrailingSlash(path)}/file_property/:filePropertyId/:detailType`}
        customRender={({ match }) => (
          <FilePropertyContainer
            fileId={Number(match.params['fileId'])}
            filePropertyId={Number(match.params['filePropertyId'])}
          />
        )}
        key={'file_property'}
        title={'File Property'}
      />
      <Redirect
        from={`${stripTrailingSlash(path)}/file/`}
        to={`${stripTrailingSlash(url)}/file/${FileTabType.FILE_DETAILS}`}
      />
      <Redirect
        from={`${stripTrailingSlash(path)}/file_property/:filePropertyId`}
        to={`${stripTrailingSlash(url)}/file_property/:filePropertyId/${
          TabRouteType.PROPERTY_LTSA
        }`}
      />
      <Redirect
        from={`${stripTrailingSlash(path)}`}
        to={`${stripTrailingSlash(url)}/file/${FileTabType.FILE_DETAILS}`}
      />
    </Switch>
  );
};

export default FileBodyTabTabRouter;
