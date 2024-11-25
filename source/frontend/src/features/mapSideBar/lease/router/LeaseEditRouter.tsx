import React from 'react';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';

import usePathResolver from '../../shared/sidebarPathSolver';

export interface ILeaseRouterProps {
  a?: string;
}

export const LeaseEditRouter: React.FC<ILeaseRouterProps> = props => {
  const { path, url } = useRouteMatch();

  const history = useHistory();
  const match = useRouteMatch();
  const pathResolver = usePathResolver();

  // render edit forms
  return <Switch></Switch>;
};

export default LeaseEditRouter;
