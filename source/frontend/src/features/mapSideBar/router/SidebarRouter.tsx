import { memo } from 'react';
import { Route, Switch } from 'react-router-dom';

import FileCreateRouter from './FileCreateRouter';
import FileEditPropertiesRouter from './FileEditProperties';
import FileViewRouter from './FileViewRouter';

export const SidebarRouter: React.FunctionComponent = memo(() => {
  return (
    <Switch>
      <Route path={`/mapview/sidebar/_temp_/new`}>
        <FileCreateRouter />
      </Route>
      <Route path={`/mapview/sidebar/_temp_/edit-properties`}>
        <FileEditPropertiesRouter />
      </Route>
      <Route path={`/mapview/sidebar/_temp_`}>
        <FileViewRouter />
      </Route>
    </Switch>
  );
});

export default SidebarRouter;
