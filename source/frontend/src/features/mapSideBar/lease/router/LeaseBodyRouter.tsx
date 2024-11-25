import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { stripTrailingSlash } from '@/utils';

import { FileBodyView } from '../../shared/fileBody/fileBodyView';
import LeaseBodyContainer from '../LeaseBodyContainer';
import LeaseEditRouter from './LeaseEditRouter';

export const LeaseBodyRouter: React.FC<unknown> = () => {
  const { path } = useRouteMatch();

  const match = useRouteMatch();

  // render edit forms
  return (
    <Switch>
      <Route path={`${stripTrailingSlash(path)}/edit`}>
        <LeaseEditRouter />
      </Route>
      <Route path={`${stripTrailingSlash(path)}`}>
        <LeaseBodyContainer leaseFileId={Number(match.params['fileId'])} View={FileBodyView} />
      </Route>
    </Switch>
  );
};

export default LeaseBodyRouter;
