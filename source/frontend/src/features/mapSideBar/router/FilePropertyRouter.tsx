import React from 'react';
import { Switch, useHistory, useRouteMatch } from 'react-router-dom';

import { Claims } from '@/constants';
import AppRoute from '@/utils/AppRoute';

import LeasePropertyEditContainer from '../lease/LeasePropertyEditContainer';

export const FilePropertyRouter: React.FC<unknown> = () => {
  const history = useHistory();
  const match = useRouteMatch();

  // render edit forms
  return (
    <Switch>
      <AppRoute
        path={`${match.path}/lease/:fileId`}
        customRender={({ match }) => (
          <LeasePropertyEditContainer
            leaseId={Number(match.params.fileId)}
            onSuccess={() => {
              history.push(`/mapview/sidebar/lease/${Number(match.params.fileId)}`);
            }}
          />
        )}
        claim={Claims.LEASE_EDIT}
        key={'EditLeaseProperties'}
        title={'Edit Lease Properties'}
      />
    </Switch>
  );
};

export default FilePropertyRouter;
