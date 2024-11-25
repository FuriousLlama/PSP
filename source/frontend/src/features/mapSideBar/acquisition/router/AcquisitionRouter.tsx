import React from 'react';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';

import Claims from '@/constants/claims';
import AppRoute from '@/utils/AppRoute';

import AcquisitionPropertyEditContainer from '../AcquistionPropertyEditContainer';
import AddAcquisitionContainer from '../add/AddAcquisitionContainer';

export interface IAcquisitionRouterProps {
  onClose: () => void;
}

export const AcquisitionRouter: React.FC<IAcquisitionRouterProps> = ({ onClose }) => {
  const history = useHistory();
  const { path } = useRouteMatch();

  return (
    <Switch>
      <AppRoute
        path={`${path}/new`}
        customRender={() => (
          <AddAcquisitionContainer
            onClose={onClose}
            onSuccess={(newAcquisitionId: number) => {
              history.push(`/mapview/sidebar/acquisition/${newAcquisitionId}`);
            }}
          />
        )}
        claim={Claims.ACQUISITION_ADD}
        key={'NewAcquisition'}
        title={'Create Acquisition File'}
      />
      <AppRoute
        path={`${path}/:fileId/property/selector`}
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

export default AcquisitionRouter;
