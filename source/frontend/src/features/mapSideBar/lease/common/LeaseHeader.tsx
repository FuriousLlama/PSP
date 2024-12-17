import moment from 'moment';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import styled from 'styled-components';

import AuditSection from '@/components/common/HeaderField/AuditSection';
import {
  HeaderContentCol,
  HeaderField,
  HeaderLabelCol,
} from '@/components/common/HeaderField/HeaderField';
import StatusField from '@/components/common/HeaderField/StatusField';
import { StyledFiller } from '@/components/common/HeaderField/styles';
import { InlineFlexDiv } from '@/components/common/styles';
import { LeaseHeaderAddresses } from '@/features/leases/detail/LeaseHeaderAddresses';
import { getCalculatedExpiry } from '@/features/leases/leaseUtils';
import { useLeaseRepository } from '@/hooks/repositories/useLeaseRepository';
import { useLeaseStakeholderRepository } from '@/hooks/repositories/useLeaseStakeholderRepository';
import { usePropertyLeaseRepository } from '@/hooks/repositories/usePropertyLeaseRepository';
import { Api_LastUpdatedBy } from '@/models/api/File';
import { ApiGen_CodeTypes_LeasePaymentReceivableTypes } from '@/models/api/generated/ApiGen_CodeTypes_LeasePaymentReceivableTypes';
import { ApiGen_CodeTypes_LeaseStatusTypes } from '@/models/api/generated/ApiGen_CodeTypes_LeaseStatusTypes';
import { ApiGen_Concepts_Lease } from '@/models/api/generated/ApiGen_Concepts_Lease';
import { exists, prettyFormatDate } from '@/utils';

import { SideBarContext } from '../../context/sidebarContext';
import HistoricalNumbersContainer from '../../shared/header/HistoricalNumberContainer';
import { HistoricalNumberSectionView } from '../../shared/header/HistoricalNumberSectionView';
import { LeaseHeaderStakeholders } from './LeaseHeaderTenants';

export interface ILeaseHeaderProps {
  leaseId: number;
}

export const LeaseHeader: React.FC<ILeaseHeaderProps> = ({ leaseId }) => {
  const [lease, setLease] = useState<ApiGen_Concepts_Lease | null>(null);
  const [lastUpdatedBy, setLastUpdatedBy] = useState<Api_LastUpdatedBy | null>(null);

  const { fileProperties, staleLastUpdateBy } = useContext(SideBarContext);

  const {
    getLease: { execute: getLease, loading: getLeaseLoading },
    getLeaseRenewals: { execute: getRenewals, loading: getLeaseRenewalsLoading },

    getLastUpdatedBy: { execute: getLastUpdatedBy, loading: getLastUpdatedByLoading },
  } = useLeaseRepository();

  const {
    getPropertyLeases: { execute: getProperties, loading: propertyLeasesLoading },
  } = usePropertyLeaseRepository();

  const {
    getLeaseStakeholders: { execute: getStakeholders, loading: getLeaseStakeholdersLoading },
  } = useLeaseStakeholderRepository();

  const propertyIds = fileProperties?.map(fp => fp.propertyId) ?? [];

  const calculatedExpiry = exists(lease) ? getCalculatedExpiry(lease, lease.renewals || []) : '';
  const isExpired = moment().isAfter(moment(calculatedExpiry, 'YYYY-MM-DD'), 'day');

  const stakeholdersLabel =
    lease?.paymentReceivableType.id === ApiGen_CodeTypes_LeasePaymentReceivableTypes.RCVBL
      ? 'Tenant:'
      : 'Payee:';

  const fetchLease = useCallback(async () => {
    if (leaseId) {
      const getLeasePromise = getLease(leaseId);
      const getRenewalsPromise = getRenewals(leaseId);
      const getPropertiesPromise = getProperties(leaseId);
      const getLeaseStakeholders = getStakeholders(leaseId);
      const getLastUpdatedByPromise = getLastUpdatedBy(leaseId);

      const [
        leaseResponse,
        renewalsResponse,
        propertiesResponse,
        stakeholdersResponse,
        lastUpdatedBy,
      ] = await Promise.all([
        getLeasePromise,
        getRenewalsPromise,
        getPropertiesPromise,
        getLeaseStakeholders,
        getLastUpdatedByPromise,
      ]);

      if (exists(leaseResponse)) {
        leaseResponse.renewals = renewalsResponse;
        leaseResponse.fileProperties = propertiesResponse;
        leaseResponse.stakeholders = stakeholdersResponse;
        setLease(leaseResponse);
      }

      if (exists(lastUpdatedBy)) {
        setLastUpdatedBy(lastUpdatedBy);
      }
    }
  }, [getLastUpdatedBy, getLease, getProperties, getRenewals, getStakeholders, leaseId]);

  useEffect(() => {
    fetchLease();
  }, [fetchLease]);

  return (
    <Container>
      <Row className="no-gutters">
        <Col xs="8">
          <HeaderField label="Lease/Licence #" labelWidth="4" contentWidth="8">
            <span className="pr-4">{lease?.lFileNo ?? ''}</span>
            <StyledGreenText>{lease?.paymentReceivableType?.description ?? ''}</StyledGreenText>
          </HeaderField>
          <HeaderField label="Property:" labelWidth="4" contentWidth="8">
            <LeaseHeaderAddresses
              propertyLeases={lease?.fileProperties ?? []}
              maxCollapsedLength={1}
              delimiter={<br />}
            />
          </HeaderField>
          <HeaderField label={stakeholdersLabel} labelWidth="4" contentWidth="8">
            <LeaseHeaderStakeholders
              stakeholders={lease?.stakeholders ?? []}
              maxCollapsedLength={1}
              delimiter={<br />}
            />
          </HeaderField>
          <Row className="flex-nowrap">
            <HeaderLabelCol
              label="Commencement:"
              labelWidth="4"
              tooltip="The start date defined in the agreement"
            />
            <HeaderContentCol contentWidth="3">
              {prettyFormatDate(lease?.startDate)}
            </HeaderContentCol>
            <HeaderLabelCol label="Expiry:" tooltip="The end date specified in the agreement" />
            <HeaderContentCol>
              <span className="pl-2">{prettyFormatDate(calculatedExpiry)}</span>
            </HeaderContentCol>
            <HeaderContentCol>
              {isExpired && (
                <ExpiredWarning className="ml-auto">
                  <AiOutlineExclamationCircle size={16} />
                  &nbsp; EXPIRED
                </ExpiredWarning>
              )}
            </HeaderContentCol>
          </Row>
          <HistoricalRow>
            <Col>
              <HistoricalNumbersContainer
                propertyIds={propertyIds}
                labelWidth="4"
                contentWidth="8"
                View={HistoricalNumberSectionView}
              />
            </Col>
          </HistoricalRow>
        </Col>

        <Col>
          <StyledFiller>
            <AuditSection lastUpdatedBy={lastUpdatedBy} baseAudit={lease} />
            {exists(lease?.fileStatusTypeCode) && (
              <StatusField
                preText="File:"
                statusCodeType={lease.fileStatusTypeCode}
                statusCodeDate={
                  lease?.fileStatusTypeCode?.id === ApiGen_CodeTypes_LeaseStatusTypes.TERMINATED
                    ? lease?.terminationDate
                    : undefined
                }
              />
            )}
          </StyledFiller>
        </Col>
      </Row>
    </Container>
  );
};

export default LeaseHeader;

const HistoricalRow = styled(Row)`
  margin-right: -1.25rem;
`;

const Container = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom-style: solid;
  border-bottom-color: grey;
  border-bottom-width: 0.1rem;
`;

const StyledGreenText = styled.span`
  font-weight: bold;
  color: ${props => props.theme.bcTokens.iconsColorSuccess};
`;

export const ExpiredWarning = styled(InlineFlexDiv)`
  color: ${props => props.theme.bcTokens.surfaceColorPrimaryDangerButtonDefault};
  background-color: ${props => props.theme.css.dangerBackgroundColor};
  border-radius: 0.4rem;
  letter-spacing: 0.1rem;
  padding: 0.2rem;
  margin-right: 0.5rem;
  font-family: 'BCSans-Bold';
  font-size: 1.4rem;
  align-items: center;
  width: fit-content;
`;
