import React, { useCallback } from 'react';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';

import AppRoute from '@/utils/AppRoute';

import { NavComponent } from './navComponent';

export interface IFileBodyAddDetailProps {
  navComponents: NavComponent[];
}

export const FileBodyAddDetailRouter: React.FC<IFileBodyAddDetailProps> = ({ navComponents }) => {
  const match = useRouteMatch();
  const history = useHistory();

  const onClose = useCallback(
    (nextLocation = '/mapview') => {
      history.push(nextLocation);
    },
    [history],
  );

  // render edit forms
  return (
    <Switch>
      {navComponents.map((obj: NavComponent) => (
        <AppRoute
          path={`${match.path}/${obj.matcher}`}
          customRender={props => obj.component(props, onClose)}
          claim={obj.claims}
          key={obj.matcher}
          title={obj.title}
        />
      ))}
    </Switch>
  );
};

export default FileBodyAddDetailRouter;
