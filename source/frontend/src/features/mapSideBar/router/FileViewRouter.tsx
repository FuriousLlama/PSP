import { memo, useCallback, useEffect } from 'react';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';

import { SideBarType } from '@/components/common/mapFSM/machineDefinition/types';
import { useMapStateMachine } from '@/components/common/mapFSM/MapStateMachineContext';
import Claims from '@/constants/claims';
import AppRoute from '@/utils/AppRoute';

import AcquisitionContainer from '../acquisition/AcquisitionContainer';
import AcquisitionView from '../acquisition/AcquisitionView';
import DispositionContainer from '../disposition/DispositionContainer';
import DispositionView from '../disposition/DispositionView';
import LeaseContainer from '../lease/LeaseContainer';
import ProjectContainer from '../project/ProjectContainer';
import ProjectContainerView from '../project/ProjectContainerView';
import { NavComponent } from '../shared/router/navComponent';

const navigations: NavComponent[] = [
  {
    matcher: 'acquisition',
    claims: [Claims.ACQUISITION_VIEW],
    title: 'Acquisition File',
    component: ({ match }, onClose) => (
      <AcquisitionContainer
        acquisitionFileId={Number(match.params.fileId)}
        onClose={onClose}
        View={AcquisitionView}
      />
    ),
  },
  {
    matcher: 'disposition',
    claims: [Claims.DISPOSITION_VIEW],
    title: 'Disposition File',
    component: ({ match }, onClose) => (
      <DispositionContainer
        dispositionFileId={Number(match.params.id)}
        onClose={onClose}
        View={DispositionView}
      />
    ),
  },
  {
    matcher: 'project',
    claims: [Claims.PROJECT_VIEW],
    title: 'Project',
    component: ({ match }, onClose) => (
      <ProjectContainer
        projectId={Number(match.params.id)}
        onClose={onClose}
        View={ProjectContainerView}
      />
    ),
  },
  {
    matcher: 'lease',
    claims: [Claims.LEASE_VIEW],
    title: 'Lease / Licence File',
    component: ({ match }, onClose) => (
      <LeaseContainer leaseId={Number(match.params.fileId)} onClose={onClose} />
    ),
  },
];

export const FileViewRouter: React.FunctionComponent = memo(() => {
  const { openSidebar, closeSidebar } = useMapStateMachine();
  const match = useRouteMatch();

  useEffect(() => {
    openSidebar(SideBarType.FILE_INFORMATION);
  }, [openSidebar]);

  const history = useHistory();

  const onClose = useCallback(
    (nextLocation = '/mapview') => {
      history.push(nextLocation);
    },
    [history],
  );

  return (
    <Switch>
      {navigations.map((obj: NavComponent) => (
        <AppRoute
          path={`${match.path}/${obj.matcher}/:fileId`}
          customRender={props => obj.component(props, onClose)}
          claim={obj.claims}
          key={obj.matcher}
          title={obj.title}
        />
      ))}
    </Switch>
  );
});

export default FileViewRouter;
