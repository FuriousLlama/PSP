import { Col, Row } from 'react-bootstrap';
import { FaExternalLinkAlt, FaMoneyCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import EditButton from '@/components/common/EditButton';
import { HeaderField } from '@/components/common/HeaderField/HeaderField';
import LoadingBackdrop from '@/components/common/LoadingBackdrop';
import { Section } from '@/components/common/Section/Section';
import { SectionField } from '@/components/common/Section/SectionField';
import { StyledSummarySection } from '@/components/common/Section/SectionStyles';
import { StyledAddButton } from '@/components/common/styles';
import { Claims, Roles } from '@/constants';
import useKeycloakWrapper from '@/hooks/useKeycloakWrapper';
import { Api_CompensationPayee } from '@/models/api/CompensationPayee';
import { Api_CompensationRequisition } from '@/models/api/CompensationRequisition';
import { Api_Product, Api_Project } from '@/models/api/Project';
import { formatMoney, prettyFormatDate } from '@/utils';
import { formatApiPersonNames } from '@/utils/personUtils';

import { DetailAcquisitionFileOwner } from '../../fileDetails/detail/models';

export interface CompensationRequisitionDetailViewProps {
  compensation: Api_CompensationRequisition;
  compensationPayee?: Api_CompensationPayee;
  acqFileProject?: Api_Project;
  acqFileProduct?: Api_Product | undefined;
  clientConstant: string;
  loading: boolean;
  setEditMode: (editMode: boolean) => void;
  onGenerate: (compensation: Api_CompensationRequisition) => void;
}

interface PayeeViewDetails {
  displayName: string;
  isGstApplicable: boolean;
  gstNumber: string;
  preTaxAmount: number;
  taxAmount: number;
  totalAmount: number;
  goodTrust: boolean;
  contactEnabled: boolean;
  personId: number | null;
}

export const CompensationRequisitionDetailView: React.FunctionComponent<
  React.PropsWithChildren<CompensationRequisitionDetailViewProps>
> = ({
  compensation,
  compensationPayee,
  acqFileProject,
  acqFileProduct,
  clientConstant,
  loading,
  setEditMode,
  onGenerate,
}) => {
  const { hasClaim, hasRole } = useKeycloakWrapper();
  const getPayeeDetails = (
    compensationPayee: Api_CompensationPayee | null | undefined,
  ): PayeeViewDetails | null => {
    if (!compensationPayee) {
      return null;
    }

    let payeeDetail = {
      contactEnabled: true,
      goodTrust: compensationPayee?.isPaymentInTrust,
      personId: null,
    } as PayeeViewDetails;

    if (compensationPayee.acquisitionOwnerId) {
      const ownerDetail = DetailAcquisitionFileOwner.fromApi(compensationPayee.acquisitionOwner!);
      payeeDetail.displayName = ownerDetail.ownerName ?? '';
      payeeDetail.contactEnabled = false;
    } else if (compensationPayee.interestHolderId) {
      payeeDetail.displayName = compensationPayee.interestHolder?.person
        ? formatApiPersonNames(compensationPayee.interestHolder?.person)
        : compensationPayee.interestHolder?.organization?.name ?? '';
      payeeDetail.personId = compensationPayee.interestHolder?.person?.id!;
    } else if (compensationPayee.ownerRepresentativeId) {
      payeeDetail.displayName = formatApiPersonNames(compensationPayee.ownerRepresentative?.person);
      payeeDetail.personId = compensationPayee.ownerRepresentative?.person?.id!;
    } else if (compensationPayee.ownerSolicitorId) {
      payeeDetail.displayName = compensationPayee.ownerSolicitor?.person
        ? formatApiPersonNames(compensationPayee.ownerSolicitor?.person)
        : compensationPayee.ownerSolicitor?.organization?.name ?? '';
      payeeDetail.personId = compensationPayee.ownerSolicitor?.person?.id!;
    } else if (compensationPayee.motiSolicitorId) {
      payeeDetail.displayName = formatApiPersonNames(compensationPayee.motiSolicitor);
      payeeDetail.personId = compensationPayee.motiSolicitor?.id!;
    }

    const payeePretaxAmount = compensation?.financials
      .map(f => f.pretaxAmount ?? 0)
      .reduce((prev, next) => prev + next, 0);

    const payeeTaxAmount = compensation?.financials
      .map(f => f.taxAmount ?? 0)
      .reduce((prev, next) => prev + next, 0);

    const payeeTotalAmount = compensation?.financials
      .map(f => f.totalAmount ?? 0)
      .reduce((prev, next) => prev + next, 0);

    payeeDetail.preTaxAmount = payeePretaxAmount;
    payeeDetail.taxAmount = payeeTaxAmount;
    payeeDetail.totalAmount = payeeTotalAmount;

    var results =
      compensation.financials?.filter(el => {
        return el.isGstRequired === true;
      }) || [];

    payeeDetail.isGstApplicable = results.length > 0;

    return payeeDetail;
  };

  const payeeDetails = getPayeeDetails(compensationPayee);

  const userCanEditCompensationReq = (): boolean => {
    if (compensation.isDraft && hasClaim(Claims.COMPENSATION_REQUISITION_EDIT)) {
      return true;
    }

    if (!compensation.isDraft && hasRole(Roles.SYSTEM_ADMINISTRATOR)) {
      return true;
    }

    return false;
  };

  const editButtonBlock = (
    <EditButton
      title="Edit compensation requisition"
      onClick={() => {
        setEditMode(true);
      }}
    />
  );
  return (
    <StyledSummarySection>
      <LoadingBackdrop show={loading} parentScreen={true} />
      <Section>
        <StyledRow className="no-gutters">
          <Col xs="6">
            <HeaderField label="Client:" labelWidth="8" valueTestId="compensation-client">
              {clientConstant}
            </HeaderField>
            <HeaderField
              label="Requisition number:"
              labelWidth="8"
              valueTestId="compensation-number"
            >
              {compensation.isDraft ? 'Draft' : compensation.id}
            </HeaderField>
          </Col>
          <Col xs="6">
            <HeaderField
              label="Compensation amount:"
              labelWidth="8"
              contentWidth="4"
              valueTestId="header-pretax-amount"
            >
              <p className="mb-0 text-right">{formatMoney(payeeDetails?.preTaxAmount ?? 0)}</p>
            </HeaderField>
            <HeaderField
              label="Applicable GST:"
              labelWidth="8"
              contentWidth="4"
              valueTestId="header-tax-amount"
            >
              <p className="mb-0 text-right">{formatMoney(payeeDetails?.taxAmount ?? 0)}</p>
            </HeaderField>
            <HeaderField
              label="Total cheque amount:"
              labelWidth="8"
              contentWidth="4"
              valueTestId="header-total-amount"
            >
              <p className="mb-0 text-right">{formatMoney(payeeDetails?.totalAmount ?? 0)}</p>
            </HeaderField>
          </Col>
        </StyledRow>
      </Section>

      <Section
        header={
          <FlexDiv>
            Requisition Details
            <RightFlexDiv>
              {setEditMode !== undefined && userCanEditCompensationReq() && editButtonBlock}

              <StyledAddButton
                onClick={() => {
                  onGenerate(compensation);
                }}
              >
                <FaMoneyCheck className="mr-2" />
                Generate H120
              </StyledAddButton>
            </RightFlexDiv>
          </FlexDiv>
        }
      >
        <SectionField label="Status" labelWidth="4" data-testid="compensation-status">
          {compensation.isDraft ? 'Draft' : 'Final'}
        </SectionField>
        <SectionField label="Agreement date" labelWidth="4">
          {prettyFormatDate(compensation.agreementDate)}
        </SectionField>
        <SectionField label="Expropriation notice served date" labelWidth="4">
          {prettyFormatDate(compensation.expropriationNoticeServedDate)}
        </SectionField>
        <SectionField label="Expropriation vesting date" labelWidth="4">
          {prettyFormatDate(compensation.expropriationVestingDate)}
        </SectionField>
        <SectionField label="Special instructions" labelWidth={'12'}>
          {compensation.specialInstruction}
        </SectionField>
      </Section>

      <Section header="Financial Coding" isCollapsable initiallyExpanded>
        <SectionField label="Product" labelWidth="4">
          {acqFileProduct?.code ?? ''}
        </SectionField>
        <SectionField label="Business function" labelWidth="4">
          {acqFileProject?.code ?? ''}
        </SectionField>
        <SectionField label="Work activity" labelWidth="4">
          {acqFileProject?.workActivityCode?.code ?? ''}
        </SectionField>
        <SectionField label="Cost type" labelWidth="4">
          {acqFileProject?.costTypeCode?.code ?? ''}
        </SectionField>
        <SectionField label="Fiscal year" labelWidth="4">
          {compensation.fiscalYear ?? ''}
        </SectionField>
        <SectionField label="STOB" labelWidth="4">
          {compensation.yearlyFinancial?.code ?? ''} - {compensation.yearlyFinancial?.description}
        </SectionField>
        <SectionField label="Service line" labelWidth="4">
          {compensation.chartOfAccounts && (
            <label>
              {compensation.chartOfAccounts?.code} - {compensation.chartOfAccounts?.description}
            </label>
          )}
        </SectionField>
        <SectionField label="Responsibility centre" labelWidth="4">
          {compensation.responsibility && (
            <label>
              {compensation.responsibility?.code} - {compensation.responsibility?.description}
            </label>
          )}
        </SectionField>
      </Section>

      <Section header="Payment" isCollapsable initiallyExpanded>
        <SectionField label="Payee" labelWidth="4">
          <StyledPayeeDisplayName>
            {payeeDetails?.contactEnabled && payeeDetails?.personId && (
              <StyledLink
                target="_blank"
                rel="noopener noreferrer"
                to={`/contact/P${payeeDetails.personId}`}
              >
                <span>{payeeDetails.displayName}</span>
                <FaExternalLinkAlt className="ml-2" size="1rem" />
              </StyledLink>
            )}
            {!payeeDetails?.contactEnabled && <label>{payeeDetails?.displayName ?? ''}</label>}
            {payeeDetails?.goodTrust && <label>, in trust</label>}
          </StyledPayeeDisplayName>
        </SectionField>
        <SectionField label="Amount (before tax)">
          {formatMoney(payeeDetails?.preTaxAmount ?? 0)}
        </SectionField>
        <SectionField label="GST applicable?">
          {payeeDetails?.isGstApplicable ? 'Yes' : 'No'}
        </SectionField>
        {payeeDetails?.isGstApplicable && (
          <SectionField label="GST amount">
            {formatMoney(payeeDetails?.taxAmount ?? 0)}
          </SectionField>
        )}
        <SectionField label="Total amount">
          {formatMoney(payeeDetails?.totalAmount ?? 0)}
        </SectionField>
      </Section>

      <Section header="Financial Activities" isCollapsable initiallyExpanded>
        {compensation.financials.map((item, index) => (
          <>
            <StyledSubHeader>
              <label>Activity {index + 1}</label>
            </StyledSubHeader>
            <SectionField label="Code & Description" labelWidth="4">
              {item.financialActivityCode?.code} - {item.financialActivityCode?.description}
            </SectionField>
            <SectionField label="Amount (before tax)" labelWidth="4">
              {formatMoney(item.pretaxAmount ?? 0)}
            </SectionField>
            <SectionField label="GST applicable?" labelWidth="4">
              {item.isGstRequired ? 'Yes' : 'No'}
            </SectionField>
            <SectionField label="GST amount" labelWidth="4">
              {formatMoney(item.taxAmount ?? 0)}
            </SectionField>
            <SectionField label="Total amount" labelWidth="4">
              {formatMoney(item.totalAmount ?? 0)}
            </SectionField>
          </>
        ))}
      </Section>

      <Section>
        <SectionField label="Detailed remarks" labelWidth="12">
          {compensation.detailedRemarks}
        </SectionField>
      </Section>

      <Section>
        <StyledCompensationFooter>
          <Row>
            <Col className="pr-0 text-right">
              <label>Compensation amount:</label>
            </Col>
            <Col xs="3" className="pl-1 text-right">
              <span>{formatMoney(payeeDetails?.preTaxAmount ?? 0)}</span>
            </Col>
          </Row>
          <Row>
            <Col className="pr-0 text-right">
              <label>Applicable GST:</label>
            </Col>
            <Col xs="3" className="pl-1 text-right">
              <span>{formatMoney(payeeDetails?.taxAmount ?? 0)}</span>
            </Col>
          </Row>
          <Row>
            <Col className="pr-0 text-right">
              <label>Total cheque amount:</label>
            </Col>
            <Col xs="3" className="pl-1 text-right">
              <span>{formatMoney(payeeDetails?.totalAmount ?? 0)}</span>
            </Col>
          </Row>
        </StyledCompensationFooter>
      </Section>
    </StyledSummarySection>
  );
};

export default CompensationRequisitionDetailView;

const StyledRow = styled(Row)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
`;

const FlexDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
`;

const RightFlexDiv = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const StyledCompensationFooter = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const StyledPayeeDisplayName = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  text-align: left;
  height: 100%;
  overflow-y: auto;
  padding-bottom: 1rem;
`;

const StyledSubHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid 0.1rem ${props => props.theme.css.primaryColor};
  margin-bottom: 2rem;

  label {
    color: ${props => props.theme.css.primaryColor};
    font-family: 'BCSans-Bold';
    font-size: 1.75rem;
    width: 100%;
    text-align: left;
  }

  button {
    margin-bottom: 1rem;
  }
`;