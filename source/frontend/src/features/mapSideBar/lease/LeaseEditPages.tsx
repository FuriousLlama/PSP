import Claims from '@/constants/claims';
import UpdateLeaseChecklistContainer from '@/features/leases/detail/LeasePages/checklist/update/UpdateLeaseChecklistContainer';
import UpdateLeaseContainer from '@/features/leases/detail/LeasePages/details/UpdateLeaseContainer';
import UpdateLeaseForm from '@/features/leases/detail/LeasePages/details/UpdateLeaseForm';
import { AddImprovementsContainer } from '@/features/leases/detail/LeasePages/improvements/AddImprovementsContainer';
import EditInsuranceContainer from '@/features/leases/detail/LeasePages/insurance/edit/EditInsuranceContainer';
import AddLeaseStakeholderContainer from '@/features/leases/detail/LeasePages/stakeholders/AddLeaseStakeholderContainer';
import AddLeaseStakeholderForm from '@/features/leases/detail/LeasePages/stakeholders/AddLeaseStakeholderForm';

import { NavComponent } from '../shared/router/navComponent';
import { UpdateChecklistForm } from '../shared/tabs/checklist/update/UpdateChecklistForm';
import { TabRouteType } from '../shared/tabs/RouterTabs';
import ConsultationAddContainer from './tabs/consultations/edit/ConsultationAddContainer';
import ConsultationEditForm from './tabs/consultations/edit/ConsultationEditForm';
import ConsultationUpdateContainer from './tabs/consultations/edit/ConsultationUpdateContainer';

const leaseEditDetailNavigations: NavComponent[] = [
  {
    matcher: TabRouteType.fileDetails,
    claims: [Claims.LEASE_EDIT],
    title: 'Update Lease File',
    component: ({ match }, onClose) => (
      <UpdateLeaseContainer leaseId={Number(match.params.fileId)} View={UpdateLeaseForm} />
    ),
  },
  {
    matcher: TabRouteType.checklist,
    claims: [Claims.LEASE_EDIT],
    title: 'Update Lease Checklist',
    component: ({ match }, onClose) => (
      <UpdateLeaseChecklistContainer
        leaseId={Number(match.params.fileId)}
        View={UpdateChecklistForm}
      />
    ),
  },
  {
    matcher: TabRouteType.consultations_add,
    claims: [Claims.LEASE_EDIT],
    title: 'Add Lease Approval/Consultation',
    component: ({ match }, onClose) => (
      <ConsultationAddContainer leaseId={Number(match.params.fileId)} View={ConsultationEditForm} />
    ),
  },
  {
    matcher: `${TabRouteType.consultations_edit}/:detailId`,
    claims: [Claims.LEASE_EDIT],
    title: 'Edit Lease Approval/Consultation',
    component: ({ match }, onClose) => (
      <ConsultationUpdateContainer
        leaseId={Number(match.params.fileId)}
        consultationId={Number(match.params.detailId)}
        View={ConsultationEditForm}
      />
    ),
  },
  {
    matcher: TabRouteType.tenant,
    claims: [Claims.LEASE_EDIT],
    title: 'Edit Lease Stakeholders',
    component: ({ match }, onClose) => (
      <AddLeaseStakeholderContainer
        leaseId={Number(match.params.fileId)}
        View={AddLeaseStakeholderForm}
      />
    ),
  },
  {
    matcher: TabRouteType.improvements,
    claims: [Claims.LEASE_EDIT],
    title: 'Edit Lease Improvements',
    component: ({ match }, onClose) => (
      <AddImprovementsContainer leaseId={Number(match.params.fileId)} />
    ),
  },
  {
    matcher: TabRouteType.insurance,
    claims: [Claims.LEASE_EDIT],
    title: 'Edit Lease Insurance',
    component: ({ match }, onClose) => (
      <EditInsuranceContainer leaseId={Number(match.params.fileId)} />
    ),
  },
];

export default leaseEditDetailNavigations;
