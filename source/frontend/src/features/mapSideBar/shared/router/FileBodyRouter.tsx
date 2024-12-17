import React, { useContext } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { exists, stripTrailingSlash } from '@/utils';

import { SideBarContext } from '../../context/sidebarContext';
import { FileBodyView } from '../../shared/fileBody/fileBodyView';
import FileBodyEditRouter from './FileBodyEditRouter';

export const FileBodyRouter: React.FC = () => {
  const match = useRouteMatch();

  const { fileComponents } = useContext(SideBarContext);

  if (!exists(fileComponents)) {
    return <></>;
  }

  const FileBodyContainer = fileComponents.fileBodyContainer;

  // render edit forms
  return (
    <Switch>
      <Route path={`${stripTrailingSlash(match.path)}/edit`}>
        <FileBodyEditRouter navComponents={fileComponents.editNavComponents} />
      </Route>
      <Route path={`${stripTrailingSlash(match.path)}`}>
        <FileBodyContainer fileId={Number(match.params['fileId'])} View={FileBodyView} />
      </Route>
    </Switch>
  );
};

export default FileBodyRouter;
