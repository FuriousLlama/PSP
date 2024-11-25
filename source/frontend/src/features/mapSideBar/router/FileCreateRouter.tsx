import { memo, useCallback, useEffect } from 'react';
import { Redirect, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import { SideBarType } from '@/components/common/mapFSM/machineDefinition/types';
import { useMapStateMachine } from '@/components/common/mapFSM/MapStateMachineContext';
import Claims from '@/constants/claims';
import { AddLeaseContainer } from '@/features/leases';
import { isValidId } from '@/utils';
import AppRoute from '@/utils/AppRoute';

import AddAcquisitionContainer from '../acquisition/add/AddAcquisitionContainer';
import AddConsolidationContainer from '../consolidation/AddConsolidationContainer';
import AddConsolidationView from '../consolidation/AddConsolidationView';
import AddProjectContainer from '../project/add/AddProjectContainer';
import AddResearchContainer from '../research/add/AddResearchContainer';
import AddSubdivisionContainer from '../subdivision/AddSubdivisionContainer';
import AddSubdivisionContainerView from '../subdivision/AddSubdivisionView';

export const FileCreateRouter: React.FunctionComponent = memo(() => {
  console.log('FileCreateRouter');
  const history = useHistory();
  const match = useRouteMatch();

  const { openSidebar } = useMapStateMachine();
  useEffect(() => {
    openSidebar(SideBarType.FILE_CREATE);
  }, [openSidebar]);

  const onClose = useCallback(
    (nextLocation = '/mapview') => {
      //TODO: should it go back instead of the mapview by default?
      history.push(nextLocation);
    },
    [history],
  );

  return (
    <Switch>
      <AppRoute
        path={`${match.path}/acquisition`}
        customRender={() => (
          <AddAcquisitionContainer
            onClose={onClose}
            onSuccess={(newAcquisitionId: number) => {
              history.replace(`/mapview/sidebar/acquisition/${newAcquisitionId}/file`);
            }}
          />
        )}
        claim={Claims.RESEARCH_ADD}
        exact
        key={'NewAcquisition'}
        title={'Create Acquisition File'}
      />
      <AppRoute
        path={`${match.path}/research`}
        customRender={() => (
          <AddResearchContainer
            onClose={onClose}
            onSuccess={(newResearchId: number) => {
              history.replace(`/mapview/sidebar/research/${newResearchId}/file`);
            }}
          />
        )}
        claim={Claims.RESEARCH_ADD}
        exact
        key={'NewResearch'}
        title={'Create Research File'}
      />
      <AppRoute
        path={`${match.path}/lease`}
        customRender={() => (
          <AddLeaseContainer
            onClose={onClose}
            onSuccess={(newLeaseId: number) => {
              history.replace(`/mapview/sidebar/lease/${newLeaseId}/file`);
            }}
          />
        )}
        claim={Claims.LEASE_ADD}
        exact
        key={'NewLease'}
        title={'Create Lease'}
      />
      <AppRoute
        path={`${match.path}/project`}
        customRender={() => (
          <AddProjectContainer
            onClose={onClose}
            onSuccess={(newProjectId: number) => {
              history.replace(`/mapview/sidebar/project/${newProjectId}/file`);
            }}
          />
        )}
        claim={Claims.PROJECT_ADD}
        exact
        key={'NewProject'}
        title={'Create Project'}
      />
      <AppRoute
        path={`${match.path}/subdivision`}
        customRender={() => (
          <AddSubdivisionContainer
            onClose={onClose}
            View={AddSubdivisionContainerView}
            onSuccess={(propertyId: number | undefined) => {
              if (isValidId(propertyId)) {
                history.replace(`/mapview/sidebar/property/${propertyId}/file`);
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
        path={`${match.path}/consolidation`}
        customRender={() => (
          <AddConsolidationContainer
            onClose={onClose}
            View={AddConsolidationView}
            onSuccess={(propertyId: number | undefined) => {
              if (isValidId(propertyId)) {
                history.replace(`/mapview/sidebar/property/${propertyId}/file`);
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
      <AppRoute title="*" path="*" customComponent={() => <Redirect to="/page-not-found" />} />
    </Switch>
  );
});

export default FileCreateRouter;
