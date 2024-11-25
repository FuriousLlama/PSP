import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import { Claims } from '@/constants';
import { ApiGen_Concepts_AcquisitionFile } from '@/models/api/generated/ApiGen_Concepts_AcquisitionFile';
import { stripTrailingSlash } from '@/utils';
import AppRoute from '@/utils/AppRoute';

import { FileTabType } from '../../shared/detail/FileTabs';
import usePathResolver from '../../shared/sidebarPathSolver';
import { UpdateChecklistForm } from '../../shared/tabs/checklist/update/UpdateChecklistForm';
import AddAcquisitionAgreementContainer from '../tabs/agreement/add/AddAcquisitionAgreementContainer';
import UpdateAcquisitionAgreementForm from '../tabs/agreement/common/UpdateAcquisitionAgreementForm';
import UpdateAcquisitionAgreementContainer from '../tabs/agreement/update/UpdateAcquisitionAgreementContainer';
import { UpdateAcquisitionChecklistContainer } from '../tabs/checklist/update/UpdateAcquisitionChecklistContainer';
import AddForm8Container from '../tabs/expropriation/form8/add/AddForm8Container';
import UpdateForm8Container from '../tabs/expropriation/form8/update/UpdateForm8Container';
import UpdateForm8Form from '../tabs/expropriation/form8/UpdateForm8Form';
import { UpdateAcquisitionContainer } from '../tabs/fileDetails/update/UpdateAcquisitionContainer';
import { UpdateAcquisitionForm } from '../tabs/fileDetails/update/UpdateAcquisitionForm';
import { UpdateStakeHolderContainer } from '../tabs/stakeholders/update/UpdateStakeHolderContainer';
import { UpdateStakeHolderForm } from '../tabs/stakeholders/update/UpdateStakeHolderForm';

export interface IAcquisitionRouterProps {
  acquisitionFile?: ApiGen_Concepts_AcquisitionFile;
}

export const AcquisitionEditRouter: React.FC<IAcquisitionRouterProps> = props => {
  const { path, url } = useRouteMatch();

  const history = useHistory();
  const match = useRouteMatch();
  const pathResolver = usePathResolver();

  // render edit forms
  return (
    <Switch>
      <Route exact path={`${stripTrailingSlash(path)}/${FileTabType.FILE_DETAILS}`}>
        <UpdateAcquisitionContainer
          acquisitionFileId={Number(match.params['fileId'])}
          onSuccess={() => {
            pathResolver.showDetail(
              'acquisition',
              match.params['fileId'],
              FileTabType.FILE_DETAILS,
            );
          }}
          View={UpdateAcquisitionForm}
        />
      </Route>
      <Route exact path={`${stripTrailingSlash(path)}/${FileTabType.CHECKLIST}`}>
        <UpdateAcquisitionChecklistContainer
          acquisitionFile={props.acquisitionFile}
          onSuccess={() => {
            history.push(`${stripTrailingSlash(match.url)}`);
          }}
          View={UpdateChecklistForm}
        />
      </Route>
      <Route exact path={`${stripTrailingSlash(path)}/${FileTabType.STAKEHOLDERS}`}>
        <UpdateStakeHolderContainer
          View={UpdateStakeHolderForm}
          acquisitionFile={props.acquisitionFile}
          onSuccess={() => {
            history.push(`${stripTrailingSlash(match.url)}`);
          }}
        />
      </Route>
      <AppRoute
        exact
        path={`${stripTrailingSlash(path)}/${FileTabType.AGREEMENTS}`}
        customRender={() =>
          props.acquisitionFile?.id ? (
            <AddAcquisitionAgreementContainer
              acquisitionFileId={props.acquisitionFile?.id}
              View={UpdateAcquisitionAgreementForm}
              onSuccess={() => {
                history.push(`${stripTrailingSlash(match.url)}`);
              }}
            />
          ) : null
        }
        claim={Claims.ACQUISITION_EDIT}
        key={'agreement'}
        title={'Add Agreement'}
      />
      <AppRoute
        path={`${stripTrailingSlash(path)}/${FileTabType.AGREEMENTS}/:agreementId`}
        customRender={({ match }) =>
          props.acquisitionFile?.id ? (
            <UpdateAcquisitionAgreementContainer
              acquisitionFileId={props.acquisitionFile?.id}
              agreementId={match.params.agreementId}
              View={UpdateAcquisitionAgreementForm}
              onSuccess={() => {
                history.push(`${stripTrailingSlash(match.url)}`);
              }}
            />
          ) : null
        }
        claim={Claims.ACQUISITION_EDIT}
        key={'updateAgreement'}
        title={'Update Agreement'}
      />
      <AppRoute
        exact
        path={`${stripTrailingSlash(path)}/${FileTabType.EXPROPRIATION}/form8/`}
        customRender={() =>
          props.acquisitionFile?.id ? (
            <AddForm8Container
              acquisitionFileId={props.acquisitionFile?.id}
              View={UpdateForm8Form}
              onSuccess={() => {
                history.push(`${stripTrailingSlash(match.url)}`);
              }}
            />
          ) : null
        }
        claim={Claims.ACQUISITION_EDIT}
        key={'expropriation'}
        title={'Add Expropriation'}
      />
      <AppRoute
        path={`${stripTrailingSlash(path)}/${FileTabType.EXPROPRIATION}/form8/:form8Id`}
        customRender={({ match }) => (
          <UpdateForm8Container
            form8Id={+match.params.form8Id}
            View={UpdateForm8Form}
            onSuccess={() => {
              history.push(`${stripTrailingSlash(match.url)}`);
            }}
          />
        )}
        claim={Claims.ACQUISITION_EDIT}
        key={'expropriation'}
        title={'Expropriation'}
      />
    </Switch>
  );
};

export default AcquisitionEditRouter;
