import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { stripTrailingSlash } from '@/utils';

import { FileBodyView } from '../../shared/fileBody/fileBodyView';
import FileBodyContainer from '../fileBody/fileBodyContainer';
import FileBodyEditRouter from './FileBodyEditRouter';
import { NavComponent } from './navComponent';

export interface IFileBodyRouterProps {
  editComponents: NavComponent[];
}

export const FileBodyRouter: React.FC<IFileBodyRouterProps> = ({ editComponents }) => {
  const { path } = useRouteMatch();

  const match = useRouteMatch();

  // render edit forms
  return (
    <Switch>
      <Route path={`${stripTrailingSlash(path)}/edit`}>
        <FileBodyEditRouter navComponents={editComponents} />
      </Route>
      <Route path={`${stripTrailingSlash(path)}`}>
        <FileBodyContainer fileId={Number(match.params['fileId'])} View={FileBodyView} />
      </Route>
    </Switch>
  );
};

export default FileBodyRouter;
