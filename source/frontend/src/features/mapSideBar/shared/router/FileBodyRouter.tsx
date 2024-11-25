import React from 'react';
import { Route, RouteComponentProps, Switch, useRouteMatch } from 'react-router-dom';

import { stripTrailingSlash } from '@/utils';

interface IBodyRouter {
  editNode: (props: RouteComponentProps<any>) => React.ReactNode;
  viewNode: (props: RouteComponentProps<any>) => React.ReactNode;
}

export const BodyRouter: React.FC<IBodyRouter> = ({ editNode, viewNode }) => {
  const { path } = useRouteMatch();

  // render edit forms
  return (
    <Switch>
      <Route path={`${stripTrailingSlash(path)}/edit`} render={editNode} />
      <Route path={`${stripTrailingSlash(path)}`} render={viewNode} />
    </Switch>
  );
};

export default BodyRouter;
