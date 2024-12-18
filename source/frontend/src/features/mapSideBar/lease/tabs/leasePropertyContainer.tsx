import React, { useCallback, useContext, useMemo, useState } from 'react';

import { PROPERTY_TYPES, useComposedProperties } from '@/hooks/repositories/useComposedProperties';
import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';
import { useLeaseStakeholderRepository } from '@/hooks/repositories/useLeaseStakeholderRepository';
import { exists, getLatLng, isValidId } from '@/utils';

import { SideBarContext } from '../../context/sidebarContext';
import { usePropertyDetails } from '../../hooks/usePropertyDetails';
import { getLeaseInfo, LeaseAssociationInfo } from '../../property/PropertyContainer';
import BcAssessmentTabView from '../../property/tabs/bcAssessment/BcAssessmentTabView';
import CrownDetailsTabView from '../../property/tabs/crown/CrownDetailsTabView';
import LtsaTabView from '../../property/tabs/ltsa/LtsaTabView';
import PropertyAssociationTabView from '../../property/tabs/propertyAssociations/PropertyAssociationTabView';
import { PropertyDetailsTabView } from '../../property/tabs/propertyDetails/detail/PropertyDetailsTabView';
import usePathResolver from '../../shared/sidebarPathSolver';
import { RouterTabs, TabContent, TabRouteType } from '../../shared/tabs/RouterTabs';

export interface IFilePropertyContainer {
  fileId: number;
  filePropertyId: number;
}

export const LeasePropertyContainer: React.FunctionComponent<IFilePropertyContainer> = ({
  fileId,
  filePropertyId,
}) => {
  const { fileProperties } = useContext(SideBarContext);
  const pathResolver = usePathResolver();

  const fileProperty = useMemo(
    () => fileProperties.find(x => x.id === filePropertyId),
    [fileProperties, filePropertyId],
  );
  const pid = fileProperty?.property?.pid ?? undefined;
  const id = fileProperty?.property?.id ?? undefined;
  const location = fileProperty?.property?.location ?? undefined;
  const latLng = useMemo(() => getLatLng(location) ?? undefined, [location]);

  const composedProperties = useComposedProperties({
    pid,
    id,
    latLng,
    propertyTypes: [
      PROPERTY_TYPES.ASSOCIATIONS,
      PROPERTY_TYPES.LTSA,
      PROPERTY_TYPES.PIMS_API,
      PROPERTY_TYPES.BC_ASSESSMENT,
      PROPERTY_TYPES.CROWN_TENURES,
    ],
  });

  const { getLease } = useLeaseRepository();
  const { getLeaseStakeholders } = useLeaseStakeholderRepository();
  const { getLeaseRenewals } = useLeaseRepository();
  const [leaseAssociationInfo, setLeaseAssociationInfo] = useState<LeaseAssociationInfo>({
    leaseDetails: [],
    leaseStakeholders: [],
    leaseRenewals: [],
    loading: false,
  });

  const leaseAssociations =
    composedProperties?.propertyAssociationWrapper?.response?.leaseAssociations;

  useMemo(
    () =>
      getLeaseInfo(
        leaseAssociations,
        getLease.execute,
        getLeaseStakeholders.execute,
        getLeaseRenewals.execute,
        setLeaseAssociationInfo,
      ),
    [leaseAssociations, getLease.execute, getLeaseStakeholders.execute, getLeaseRenewals.execute],
  );

  // After API property object has been received, we query relevant map layers to find
  // additional information which we store in a different model (IPropertyDetailsForm)
  const propertyViewForm = usePropertyDetails(composedProperties.apiWrapper?.response);

  const memoedTabViews = useMemo(() => {
    const tabViews: TabContent[] = [];
    const ltsaWrapper = composedProperties.ltsaWrapper;

    tabViews.push({
      content: (
        <LtsaTabView
          ltsaData={ltsaWrapper?.response}
          ltsaRequestedOn={ltsaWrapper?.requestedOn}
          loading={ltsaWrapper?.loading ?? false}
          pid={pid?.toString()}
        />
      ),
      key: TabRouteType.PROPERTY_LTSA,
      name: 'Title',
      isFullWidth: false,
      claims: [],
    });

    if (exists(composedProperties.composedProperty?.crownTenureFeature)) {
      tabViews.push({
        content: (
          <CrownDetailsTabView
            crownFeature={composedProperties.composedProperty?.crownTenureFeature}
          />
        ),
        key: TabRouteType.PROPERTY_CROWN,
        name: 'Crown',
        isFullWidth: false,
        claims: [],
      });
    }

    tabViews.push({
      content: (
        <BcAssessmentTabView
          summaryData={composedProperties.bcAssessmentWrapper?.response}
          requestedOn={composedProperties.bcAssessmentWrapper?.requestedOn}
          loading={composedProperties.bcAssessmentWrapper?.loading ?? false}
          pid={pid?.toString()}
        />
      ),
      key: TabRouteType.PROPERTY_ASSESSMENT,
      name: 'Value',
      isFullWidth: false,
      claims: [],
    });

    if (isValidId(id)) {
      tabViews.push({
        content: (
          <PropertyDetailsTabView
            property={propertyViewForm}
            loading={composedProperties?.apiWrapper?.loading ?? false}
          />
        ),
        key: TabRouteType.PROPERTY_DETAILS,
        name: 'Property Details',
        isFullWidth: false,
        claims: [],
      });
    }
    if (isValidId(id)) {
      tabViews.push({
        content: (
          <PropertyAssociationTabView
            isLoading={
              composedProperties.propertyAssociationWrapper?.loading ??
              leaseAssociationInfo.loading ??
              false
            }
            associations={composedProperties.propertyAssociationWrapper?.response}
            associatedLeaseStakeholders={leaseAssociationInfo.leaseStakeholders}
            associatedLeaseRenewals={leaseAssociationInfo.leaseRenewals}
            associatedLeases={leaseAssociationInfo.leaseDetails}
          />
        ),
        key: TabRouteType.PROPERTY_PIMS,
        name: 'PIMS Files',
        isFullWidth: false,
        claims: [],
      });
    }
    return tabViews;
  }, [
    composedProperties?.apiWrapper?.loading,
    composedProperties.bcAssessmentWrapper?.loading,
    composedProperties.bcAssessmentWrapper?.requestedOn,
    composedProperties.bcAssessmentWrapper?.response,
    composedProperties.composedProperty?.crownTenureFeature,
    composedProperties.ltsaWrapper,
    composedProperties.propertyAssociationWrapper?.loading,
    composedProperties.propertyAssociationWrapper?.response,
    id,
    leaseAssociationInfo.leaseDetails,
    leaseAssociationInfo.leaseRenewals,
    leaseAssociationInfo.leaseStakeholders,
    leaseAssociationInfo.loading,
    pid,
    propertyViewForm,
  ]);

  const onSelect = useCallback(
    (eventKey: string | null) => {
      debugger;
      const tab = Object.values(memoedTabViews).find(tab => tab.key === eventKey);
      pathResolver.showFilePropertyDetail('lease', fileId, filePropertyId, tab.key, false);
    },
    [fileId, filePropertyId, pathResolver, memoedTabViews],
  );

  debugger;

  return (
    <RouterTabs
      defaultTabKey={TabRouteType.PROPERTY_LTSA}
      tabs={memoedTabViews}
      onTabSelect={onSelect}
    />
  );
};
