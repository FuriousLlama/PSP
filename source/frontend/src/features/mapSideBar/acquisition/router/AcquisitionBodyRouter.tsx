import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import { stripTrailingSlash } from '@/utils';

import AcquisitionFileBodyContainer from '../AcquisitionFileBodyContainer';
import { AcquisitionFileBodyView } from '../AcquisitionFileBodyView';
import AcquisitionEditRouter from './AcquisitionEditRouter';

export const AcquisitionBodyRouter: React.FC<unknown> = () => {
  const { path, url } = useRouteMatch();

  const history = useHistory();
  const match = useRouteMatch();

  // render edit forms
  return (
    <Switch>
      <Route path={`${stripTrailingSlash(path)}/edit`}>
        <AcquisitionEditRouter />
      </Route>
      <Route path={`${stripTrailingSlash(path)}`}>
        <AcquisitionFileBodyContainer
          acquisitionFileId={Number(match.params['fileId'])}
          View={AcquisitionFileBodyView}
        />
      </Route>
    </Switch>
  );
};

export default AcquisitionBodyRouter;
