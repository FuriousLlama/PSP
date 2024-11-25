import { memo, useCallback } from 'react';
import { Switch, useHistory } from 'react-router-dom';

import Claims from '@/constants/claims';
import { AddLeaseContainer } from '@/features/leases';
import { isValidId } from '@/utils';
import AppRoute from '@/utils/AppRoute';

import AddConsolidationContainer from '../consolidation/AddConsolidationContainer';
import AddConsolidationView from '../consolidation/AddConsolidationView';
import AddProjectContainer from '../project/add/AddProjectContainer';
import AddResearchContainer from '../research/add/AddResearchContainer';
import AddSubdivisionContainer from '../subdivision/AddSubdivisionContainer';
import AddSubdivisionContainerView from '../subdivision/AddSubdivisionView';

export const FileEditRouter: React.FunctionComponent = memo(() => {
  const history = useHistory();

  const onClose = useCallback(
    (nextLocation = '/mapview') => {
      history.push(nextLocation);
    },
    [history],
  );

  return (
    <Switch>
      <AppRoute
        path={`/research`}
        customRender={() => (
          <AddResearchContainer
            onClose={onClose}
            onSuccess={(newResearchId: number) => {
              history.replace(`/mapview/sidebar/research/${newResearchId}`);
            }}
          />
        )}
        claim={Claims.RESEARCH_ADD}
        exact
        key={'NewResearch'}
        title={'Create Research File'}
      />
      <AppRoute
        path={`lease`}
        customRender={() => (
          <AddLeaseContainer
            onClose={onClose}
            onSuccess={(newLeaseId: number) => {
              history.replace(`/mapview/sidebar/lease/${newLeaseId}`);
            }}
          />
        )}
        claim={Claims.LEASE_ADD}
        exact
        key={'NewLease'}
        title={'Create Lease'}
      />
      <AppRoute
        path={`project`}
        customRender={() => (
          <AddProjectContainer
            onClose={onClose}
            onSuccess={(newProjectId: number) => {
              history.replace(`/mapview/sidebar/project/${newProjectId}`);
            }}
          />
        )}
        claim={Claims.PROJECT_ADD}
        exact
        key={'NewProject'}
        title={'Create Project'}
      />
      <AppRoute
        path={`subdivision`}
        customRender={() => (
          <AddSubdivisionContainer
            onClose={onClose}
            View={AddSubdivisionContainerView}
            onSuccess={(propertyId: number | undefined) => {
              if (isValidId(propertyId)) {
                history.replace(`/mapview/sidebar/property/${propertyId}`);
              } else {
                history.replace(`/mapview`);
              }
            }}
          />
        )}
        claim={Claims.PROPERTY_EDIT}
        key={'NewSubdivision'}
        title={'Create Subdivision'}
      />
      <AppRoute
        path={`consolidation`}
        customRender={() => (
          <AddConsolidationContainer
            onClose={onClose}
            View={AddConsolidationView}
            onSuccess={(propertyId: number | undefined) => {
              if (isValidId(propertyId)) {
                history.replace(`/mapview/sidebar/property/${propertyId}`);
              } else {
                history.replace(`/mapview`);
              }
            }}
          />
        )}
        claim={Claims.PROPERTY_EDIT}
        key={'NewConsolidation'}
        title={'Create Consolidation'}
      />
    </Switch>
  );
});

export default FileEditRouter;
