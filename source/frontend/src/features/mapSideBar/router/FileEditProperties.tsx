import { memo, useCallback, useEffect } from 'react';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';

import { SideBarType } from '@/components/common/mapFSM/machineDefinition/types';
import { useMapStateMachine } from '@/components/common/mapFSM/MapStateMachineContext';
import Claims from '@/constants/claims';
import AppRoute from '@/utils/AppRoute';

import AcquisitionPropertyEditContainer from '../acquisition/AcquistionPropertyEditContainer';

export const FileEditPropertiesRouter: React.FunctionComponent = memo(() => {
  console.log('FileEditPropertiesRouter');
  const { openSidebar, closeSidebar } = useMapStateMachine();
  const match = useRouteMatch();

  useEffect(() => {
    openSidebar(SideBarType.FILE_EDIT_PROPERTIES);
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
      <AppRoute
        path={`${match.path}/acquisition/:fileId`}
        customRender={({ match }) => (
          <AcquisitionPropertyEditContainer
            acquisitionFileId={match.params['fileId']}
            onSuccess={() => {
              history.push(`/mapview/sidebar/acquisition/${match.params['fileId']}`);
            }}
          />
        )}
        claim={Claims.ACQUISITION_VIEW}
        key={'Acquisition'}
        title={'Acquisition File'}
      />
    </Switch>
  );
});

export default FileEditPropertiesRouter;
