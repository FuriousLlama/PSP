import { FormikProps } from 'formik';
import * as React from 'react';

import { LeaseFormModel } from '@/features/leases/models';
import { Api_Lease } from '@/models/api/Lease';

import { LeaseFileTabNames } from './detail/LeaseFileTabs';
import { LeaseTabsContainer } from './detail/LeaseTabsContainer';
import { LeaseContainerState, LeasePageNames, leasePages } from './LeaseContainer';

export interface IViewSelectorProps {
  lease?: Api_Lease;
  isEditing: boolean;
  setContainerState: (value: Partial<LeaseContainerState>) => void;
  refreshLease: () => void;
  setLease: (lease: Api_Lease) => void;
  activeEditForm?: LeasePageNames;
  activeTab?: LeaseFileTabNames;
  formikRef: React.RefObject<FormikProps<LeaseFormModel>>;
}

export const ViewSelector: React.FunctionComponent<IViewSelectorProps> = props => {
  if (props.isEditing && !!props.lease && props.activeEditForm) {
    const activeLeasePage = leasePages.get(props.activeEditForm);
    if (!activeLeasePage) {
      throw Error('Lease page not found');
    }
    const Component = activeLeasePage.component;
    return (
      <Component
        isEditing={props.isEditing}
        onEdit={(isEditing: boolean) => props.setContainerState({ isEditing: isEditing })}
        formikRef={props.formikRef}
      />
    );
  } else {
    // render read-only views
    return (
      <LeaseTabsContainer
        lease={props.lease}
        refreshLease={props.refreshLease}
        setLease={props.setLease}
        setContainerState={props.setContainerState}
        activeTab={props.activeTab}
        isEditing={props.isEditing}
        formikRef={props.formikRef}
      />
    );
  }
};

export default ViewSelector;