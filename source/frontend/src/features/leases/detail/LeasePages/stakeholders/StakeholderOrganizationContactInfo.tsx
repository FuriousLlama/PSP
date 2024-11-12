import { FieldArrayRenderProps, getIn, useFormikContext } from 'formik';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { SectionField } from '@/components/common/Section/SectionField';
import { getPrimaryContact } from '@/features/contacts/contactUtils';
import { LeaseFormModel } from '@/features/leases/models';
import { withNameSpace } from '@/utils/formUtils';
import { formatApiPersonNames } from '@/utils/personUtils';

import { FormStakeholder } from './models';

export interface ITenantOrganizationContactInfoProps {
  nameSpace: string;
}

/**
 * Sub-form displaying a organization tenant associated to the current lease.
 * @param {ITenantOrganizationContactInfoProps} param0
 */
export const TenantOrganizationContactInfo: React.FunctionComponent<
  React.PropsWithChildren<ITenantOrganizationContactInfoProps & Partial<FieldArrayRenderProps>>
> = ({ nameSpace }) => {
  const { values } = useFormikContext<LeaseFormModel>();
  const tenant: FormStakeholder = getIn(values, nameSpace);
  let primaryContact = tenant?.initialPrimaryContact;
  if (primaryContact?.id !== Number(tenant?.primaryContactId)) {
    primaryContact = tenant?.primaryContactId
      ? getPrimaryContact(Number(tenant?.primaryContactId), tenant) ?? undefined
      : undefined;
  }
  const primaryContactName = formatApiPersonNames(primaryContact);
  return (
    <StyledSectionWrapper>
      <SectionField labelWidth="3" label="Organization">
        {getIn(values, withNameSpace(nameSpace, 'summary')) && (
          <>
            <Link to={`/contact/${tenant?.id}`} target="_blank" rel="noopener noreferrer">
              {getIn(values, withNameSpace(nameSpace, 'summary'))} <FaExternalLinkAlt />
            </Link>
          </>
        )}
      </SectionField>
      <SectionField labelWidth="3" label="Primary Contact">
        {primaryContact && (
          <>
            <Link to={`/contact/P${primaryContact?.id}`} target="_blank" rel="noopener noreferrer">
              {primaryContactName} <FaExternalLinkAlt />
            </Link>
          </>
        )}
      </SectionField>
    </StyledSectionWrapper>
  );
};

const StyledSectionWrapper = styled.div`
  border-bottom: 0.1rem gray solid;
  padding-top: 0.5rem;
`;

export default TenantOrganizationContactInfo;
