import { Claims, NoteTypes } from '@/constants';
import DocumentListContainer from '@/features/documents/list/DocumentListContainer';
import LeaseChecklistContainer from '@/features/leases/detail/LeasePages/checklist/LeaseChecklistContainer';
import DepositsContainer from '@/features/leases/detail/LeasePages/deposits/DepositsContainer';
import LeaseDetailContainer from '@/features/leases/detail/LeasePages/details/DetailContainer';
import LeaseDetailsView from '@/features/leases/detail/LeasePages/details/LeaseDetailsForm';
import ImprovementsView from '@/features/leases/detail/LeasePages/improvements/Improvements';
import { ImprovementsContainer } from '@/features/leases/detail/LeasePages/improvements/ImprovementsContainer';
import InsuranceDetailsView from '@/features/leases/detail/LeasePages/insurance/details/Insurance';
import InsuranceContainer from '@/features/leases/detail/LeasePages/insurance/InsuranceContainer';
import PeriodPaymentsContainer from '@/features/leases/detail/LeasePages/payment/PeriodPaymentsContainer';
import PeriodPaymentsView from '@/features/leases/detail/LeasePages/payment/table/periods/PaymentPeriodsView';
import LeaseStakeholderContainer from '@/features/leases/detail/LeasePages/stakeholders/LeaseStakeholderContainer';
import LeaseStakeholderView from '@/features/leases/detail/LeasePages/stakeholders/ViewStakeholderForm';
import Surplus from '@/features/leases/detail/LeasePages/surplus/Surplus';
import NoteListView from '@/features/notes/list/NoteListView';
import { ApiGen_CodeTypes_DocumentRelationType } from '@/models/api/generated/ApiGen_CodeTypes_DocumentRelationType';
import { ApiGen_CodeTypes_FileTypes } from '@/models/api/generated/ApiGen_CodeTypes_FileTypes';
import { ApiGen_CodeTypes_LeasePaymentReceivableTypes } from '@/models/api/generated/ApiGen_CodeTypes_LeasePaymentReceivableTypes';
import { ApiGen_Concepts_Lease } from '@/models/api/generated/ApiGen_Concepts_Lease';
import { exists } from '@/utils';

import CompensationListContainer from '../../compensation/list/CompensationListContainer';
import CompensationListView from '../../compensation/list/CompensationListView';
import usePathResolver from '../../shared/sidebarPathSolver';
import { ChecklistView } from '../../shared/tabs/checklist/detail/ChecklistView';
import { TabContent, TabRouteType } from '../../shared/tabs/RouterTabs';
import ConsultationListContainer from './consultations/detail/ConsultationListContainer';
import ConsultationListView from './consultations/detail/ConsultationListView';

export const getLeaseTabs = (lease: ApiGen_Concepts_Lease, onSuccess: () => void): TabContent[] => {
  const tabViews: TabContent[] = [];

  if (!exists(lease)) {
    return [];
  }

  tabViews.push({
    content: (
      <LeaseDetailContainer
        fileId={lease.id}
        pathResolverHook={usePathResolver}
        onSuccess={onSuccess}
        View={LeaseDetailsView}
      />
    ),
    key: TabRouteType.fileDetails,
    name: 'File Details',
    isFullWidth: false,
    claims: [],
  });

  tabViews.push({
    content: (
      <LeaseChecklistContainer
        fileId={lease.id}
        pathResolverHook={usePathResolver}
        onSuccess={onSuccess}
        View={ChecklistView}
      />
    ),
    key: TabRouteType.checklist,
    name: 'Checklist',
    isFullWidth: false,
    claims: [],
  });

  tabViews.push({
    content: (
      <ConsultationListContainer
        fileId={lease.id}
        pathResolverHook={usePathResolver}
        onSuccess={onSuccess}
        View={ConsultationListView}
      />
    ),
    key: TabRouteType.consultations,
    name: 'Approval/Consultations',
    isFullWidth: false,
    claims: [],
  });

  const stakeholderPageName =
    lease?.paymentReceivableType.id === 'RCVBL' ? TabRouteType.tenant : TabRouteType.payee;

  const stakeHolderTypeName = lease?.paymentReceivableType.id === 'RCVBL' ? 'Tenant' : 'Payee';

  tabViews.push({
    content: (
      <LeaseStakeholderContainer
        fileId={lease.id}
        pathResolverHook={usePathResolver}
        onSuccess={onSuccess}
        View={LeaseStakeholderView}
      />
    ),
    key: stakeholderPageName,
    name: stakeHolderTypeName,
    isFullWidth: false,
    claims: [],
  });

  tabViews.push({
    content: (
      <ImprovementsContainer
        fileId={lease.id}
        pathResolverHook={usePathResolver}
        onSuccess={onSuccess}
        View={ImprovementsView}
      />
    ),
    key: TabRouteType.improvements,
    name: 'Improvements',
    isFullWidth: false,
    claims: [],
  });

  tabViews.push({
    content: (
      <InsuranceContainer
        fileId={lease.id}
        pathResolverHook={usePathResolver}
        onSuccess={onSuccess}
        View={InsuranceDetailsView}
      />
    ),
    key: TabRouteType.insurance,
    name: 'Insurance',
    isFullWidth: false,
    claims: [],
  });

  tabViews.push({
    content: (
      <DepositsContainer
        fileId={lease.id}
        pathResolverHook={usePathResolver}
        onSuccess={onSuccess}
        View={null}
      />
    ),
    key: TabRouteType.deposit,
    name: 'Deposit',
    isFullWidth: true,
    claims: [],
  });

  tabViews.push({
    content: (
      <PeriodPaymentsContainer
        fileId={lease.id}
        pathResolverHook={usePathResolver}
        onSuccess={onSuccess}
        View={PeriodPaymentsView}
      />
    ),
    key: TabRouteType.payments,
    name: 'Payments',
    isFullWidth: true,
    claims: [],
  });

  tabViews.push({
    content: (
      <Surplus
        fileId={lease.id}
        pathResolverHook={usePathResolver}
        onSuccess={onSuccess}
        View={null}
      />
    ),
    key: TabRouteType.surplusDeclaration,
    name: 'Surplus Declaration',
    isFullWidth: false,
    claims: [],
  });

  if (
    lease.paymentReceivableType.id === ApiGen_CodeTypes_LeasePaymentReceivableTypes.PYBLBCTFA ||
    lease.paymentReceivableType.id === ApiGen_CodeTypes_LeasePaymentReceivableTypes.PYBLMOTI
  ) {
    tabViews.push({
      content: (
        <CompensationListContainer
          fileType={ApiGen_CodeTypes_FileTypes.Lease}
          file={lease}
          View={CompensationListView}
        />
      ),
      key: TabRouteType.compensation,
      name: 'Compensation',
      isFullWidth: false,
      claims: [Claims.COMPENSATION_REQUISITION_VIEW],
    });
  }

  tabViews.push({
    content: (
      <DocumentListContainer
        parentId={lease.id.toString()}
        relationshipType={ApiGen_CodeTypes_DocumentRelationType.Leases}
        title="File Documents"
        onSuccess={onSuccess}
      />
    ),
    key: TabRouteType.documents,
    name: 'Documents',
    isFullWidth: true,
    claims: [Claims.DOCUMENT_VIEW],
  });

  tabViews.push({
    content: (
      <NoteListView type={NoteTypes.Lease_File} entityId={lease?.id} onSuccess={onSuccess} />
    ),
    key: TabRouteType.notes,
    name: 'Notes',
    isFullWidth: true,
    claims: [Claims.NOTE_VIEW],
  });

  const defaultTab = TabRouteType.fileDetails;

  /*
  const onSetActiveTab = (tab: TabRouteType) => {
    const previousTab = activeTab;
    if (previousTab === TabRouteType.compensation) {
      const backUrl = location.pathname.split('/compensation-requisition')[0];
      history.push(backUrl);
    }
    setContainerState({ activeTab: tab });
  };
  */

  return tabViews;
};

export default getLeaseTabs;
