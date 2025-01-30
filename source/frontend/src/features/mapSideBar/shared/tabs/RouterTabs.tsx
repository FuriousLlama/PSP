import { useEffect, useState } from 'react';
import { Tab } from 'react-bootstrap';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { useMapStateMachine } from '@/components/common/mapFSM/MapStateMachineContext';
import TabView from '@/components/common/TabView';
import Claims from '@/constants/claims';
import useKeycloakWrapper from '@/hooks/useKeycloakWrapper';
import { exists } from '@/utils';

export interface TabContent {
  content: React.ReactNode;
  detailId?: number;
  key: TabRouteType;
  name: string;
  isFullWidth: boolean;
  claims: Claims[];
}

export interface IRouterTabsProps {
  defaultTabKey: TabRouteType;
  tabs: TabContent[];
  onTabSelect: (tabName: string | null) => void;
}

export enum TabRouteType {
  PROPERTY_DETAILS = 'details',
  PROPERTY_LTSA = 'ltsa',
  PROPERTY_ASSESSMENT = 'bcassessment',
  PROPERTY_RESEARCH = 'research',
  PROPERTY_PIMS = 'pims',
  PROPERTY_TAKES = 'takes',
  PROPERTY_MANAGEMENT = 'management',
  PROPERTY_CROWN = 'crown',

  FILE_DETAILS = 'fileDetails',
  OFFERS_AND_SALE = 'offersAndSale',
  CHECKLIST = 'checklist',
  DOCUMENTS = 'documents',
  NOTES = 'notes',
  FORMS = 'forms',
  AGREEMENTS = 'agreements',
  COMPENSATIONS = 'compensations',
  STAKEHOLDERS = 'stakeholders',
  EXPROPRIATION = 'expropriation',
  SUB_FILES = 'subFiles',
  fileDetails = 'fileDetails',
  consultations = 'consultations',
  consultations_edit = 'consultations-edit',
  consultations_add = 'consultations-add',
  tenant = 'tenant',
  payee = 'payee',
  improvements = 'improvements',
  insurance = 'insurance',
  deposit = 'deposit',
  payments = 'payments',
  surplusDeclaration = 'surplusDeclaration',
  checklist = 'checklist',
  documents = 'documents',
  notes = 'notes',
  compensation = 'compensation',
}

let count = 0;
/**
 * Tab wrapper, provides styling and nests form components within their corresponding tabs.
 * @param param0 object containing all react components for the corresponding tabs.
 */
export const RouterTabs: React.FunctionComponent<React.PropsWithChildren<IRouterTabsProps>> = ({
  defaultTabKey,
  tabs,
  onTabSelect,
}) => {
  console.log('RouterTabs', count);
  count++;
  const history = useHistory();
  const match = useRouteMatch<{
    fileId: string;
    filePropertyId: string;
    detailType: string;
    detailId: string;
  }>();

  const { setFullWidthSideBar } = useMapStateMachine();
  const [activeTabKey, setActiveTabKey] = useState(defaultTabKey);

  const { hasClaim } = useKeycloakWrapper();

  const detailType = match.params['detailType'];

  useEffect(() => {
    const tab = tabs.find(tab => tab.key === detailType);
    if (exists(tab)) {
      setActiveTabKey(tab.key);
    }
  }, [activeTabKey, detailType, tabs]);

  useEffect(() => {
    const tab = tabs.find(tab => tab.key === detailType);
    if (exists(tab)) {
      if (tab.isFullWidth === true) {
        setFullWidthSideBar(true);
      } else {
        setFullWidthSideBar(false);
      }
      return () => setFullWidthSideBar(false);
    }
  }, [tabs, setFullWidthSideBar, detailType]);

  return (
    <TabView
      defaultActiveKey={defaultTabKey}
      activeKey={activeTabKey}
      mountOnEnter={false}
      onSelect={onTabSelect}
    >
      {tabs.map(
        (content: TabContent, index: number) =>
          (content.claims.length === 0 || hasClaim(content.claims)) && (
            <Tab eventKey={content.key} title={content.name} key={`inventory-tab-${index}`}>
              {content.content}
            </Tab>
          ),
      )}
    </TabView>
  );
};
