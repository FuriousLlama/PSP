import { memo, useCallback, useEffect } from 'react';
import { RouteComponentProps, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import { SideBarType } from '@/components/common/mapFSM/machineDefinition/types';
import { useMapStateMachine } from '@/components/common/mapFSM/MapStateMachineContext';
import Claims from '@/constants/claims';
import { LeaseContextProvider } from '@/features/leases/context/LeaseContext';
import AppRoute from '@/utils/AppRoute';

import AcquisitionFileContainer from '../acquisition/AcquisitionFileContainer';
import AcquisitionFileView from '../acquisition/AcquisitionFileView';
import DispositionContainer from '../disposition/DispositionContainer';
import DispositionView from '../disposition/DispositionView';
import LeaseContainer from '../lease/LeaseContainer';
import ProjectContainer from '../project/ProjectContainer';
import ProjectContainerView from '../project/ProjectContainerView';

interface NavComponent {
  fileType: string;
  component: (props: RouteComponentProps<any>, onClose: () => void) => React.ReactNode;
  claims: Claims[];
  title: string;
}

const navigations: NavComponent[] = [
  {
    fileType: 'acquisition',
    claims: [Claims.ACQUISITION_VIEW],
    title: 'Acquisition File',
    component: ({ match }, onClose) => (
      <AcquisitionFileContainer
        acquisitionFileId={Number(match.params.fileId)}
        onClose={onClose}
        View={AcquisitionFileView}
      />
    ),
  },
  {
    fileType: 'disposition',
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
    fileType: 'project',
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
    fileType: 'lease',
    claims: [Claims.LEASE_VIEW],
    title: 'Lease / Licence File',
    component: ({ match }, onClose) => (
      <LeaseContextProvider>
        <LeaseContainer leaseId={Number(match.params.fileId)} onClose={onClose} />
      </LeaseContextProvider>
    ),
  },
];

let counter = 0;

export const FileViewRouter: React.FunctionComponent = memo(() => {
  console.log('FileViewRouter', counter);
  counter++;
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
          path={`${match.path}/${obj.fileType}/:fileId`}
          customRender={props => obj.component(props, onClose)}
          claim={obj.claims}
          key={obj.fileType}
          title={obj.title}
        />
      ))}
    </Switch>
  );
});

export default FileViewRouter;
