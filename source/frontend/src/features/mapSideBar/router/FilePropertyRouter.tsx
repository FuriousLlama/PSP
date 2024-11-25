import React from 'react';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';

import { Claims } from '@/constants';
import AppRoute from '@/utils/AppRoute';

import AcquisitionPropertyEditContainer from '../acquisition/AcquistionPropertyEditContainer';

export const FilePropertyRouter: React.FC<unknown> = () => {
  const history = useHistory();
  const match = useRouteMatch();

  // render edit forms
  return (
    <Switch>
      <AppRoute
        path={`${match.path}/acquisition/:fileId`}
        customRender={({ match }) => (
          <AcquisitionPropertyEditContainer
            acquisitionFileId={Number(match.params.fileId)}
            onSuccess={() => {
              history.push(`/mapview/sidebar/acquisition/${Number(match.params.fileId)}`);
            }}
          />
        )}
        claim={Claims.ACQUISITION_EDIT}
        key={'EditAcquisitionProperties'}
        title={'Edit Acquisition Properties'}
      />
    </Switch>
  );
};

export default FilePropertyRouter;
