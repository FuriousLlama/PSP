import { useEffect, useState } from 'react';
import { Tab } from 'react-bootstrap';
import { generatePath, useHistory, useRouteMatch } from 'react-router-dom';

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
}

export enum TabRouteType {
  property = 'details',
  title = 'ltsa',
  value = 'bcassessment',
  research = 'research',
  pims = 'pims',
  takes = 'takes',
  management = 'management',
  crown = 'crown',
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
}) => {
  console.log('RouterTabs', count);
  count++;
  const history = useHistory();
  const match = useRouteMatch<{
    fileId: string;
    propertyId: string;
    detailType: string;
    detailId: string;
  }>();

  const { setFullWidthSideBar } = useMapStateMachine();
  const [activeTabKey, setActiveTabKey] = useState(defaultTabKey);

  const { hasClaim } = useKeycloakWrapper();

  useEffect(() => {
    if (match.params.detailType === activeTabKey) {
      return;
    }
    const tab = tabs.find(tab => tab.key === match.params.detailType);
    if (exists(tab)) {
      setActiveTabKey(tab.key);
    }
  }, [activeTabKey, match.params.detailType, tabs]);

  const detailType = match.params['detailType'];

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
      mountOnEnter={true}
      onSelect={(eventKey: string | null) => {
        const tab = Object.values(tabs).find(tab => tab.key === eventKey);
        const path = generatePath(match.path, {
          fileId: match.params.fileId,
          detailType: tab.key,
          detailId: tab.detailId,
        });
        history.push(path);
      }}
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
