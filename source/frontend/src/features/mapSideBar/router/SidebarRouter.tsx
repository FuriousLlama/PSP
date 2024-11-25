import { memo } from 'react';
import { Route, Switch } from 'react-router-dom';

import FileCreateRouter from './FileCreateRouter';
import FileEditPropertiesRouter from './FileEditProperties';
import FileViewRouter from './FileViewRouter';
let count = 0;

export const SidebarRouter: React.FunctionComponent = memo(() => {
  console.log('SidebarRouter', count);
  count++;

  return (
    <Switch>
      <Route path={`/mapview/sidebar/new`}>
        <FileCreateRouter />
      </Route>
      <Route path={`/mapview/sidebar/edit-properties`}>
        <FileEditPropertiesRouter />
      </Route>
      <Route path={`/mapview/sidebar`}>
        <FileViewRouter />
      </Route>
    </Switch>
  );
});

export default SidebarRouter;
