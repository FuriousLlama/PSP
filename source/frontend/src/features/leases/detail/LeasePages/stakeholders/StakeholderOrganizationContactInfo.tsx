import { FieldArrayRenderProps } from 'formik';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { SectionField } from '@/components/common/Section/SectionField';
import { getPrimaryContact } from '@/features/contacts/contactUtils';
import { formatApiPersonNames } from '@/utils/personUtils';

import { FormStakeholder } from './models';

export interface ITenantOrganizationContactInfoProps {
  stakeholder: FormStakeholder;
}

/**
 * Sub-form displaying a organization tenant associated to the current lease.
 * @param {ITenantOrganizationContactInfoProps} param0
 */
export const TenantOrganizationContactInfo: React.FunctionComponent<
  React.PropsWithChildren<ITenantOrganizationContactInfoProps & Partial<FieldArrayRenderProps>>
> = ({ stakeholder }) => {
  let primaryContact = stakeholder.initialPrimaryContact;
  if (primaryContact?.id !== Number(stakeholder.primaryContactId)) {
    primaryContact = stakeholder.primaryContactId
      ? getPrimaryContact(Number(stakeholder.primaryContactId), stakeholder) ?? undefined
      : undefined;
  }
  const primaryContactName = formatApiPersonNames(primaryContact);
  return (
    <div>
      <SectionField labelWidth="3" label="Organization">
        {stakeholder.summary && (
          <Link to={`/contact/${stakeholder.id}`} target="_blank" rel="noopener noreferrer">
            {stakeholder.summary} <FaExternalLinkAlt />
          </Link>
        )}
      </SectionField>
      <SectionField labelWidth="3" label="Primary Contact">
        {primaryContact && (
          <Link to={`/contact/P${primaryContact?.id}`} target="_blank" rel="noopener noreferrer">
            {primaryContactName} <FaExternalLinkAlt />
          </Link>
        )}
      </SectionField>
    </div>
  );
};

export default TenantOrganizationContactInfo;
