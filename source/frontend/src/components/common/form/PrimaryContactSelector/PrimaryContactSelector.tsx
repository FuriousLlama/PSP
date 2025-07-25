import { useFormikContext } from 'formik';
import React from 'react';

import { useOrganizationRepository } from '@/features/contacts/repositories/useOrganizationRepository';
import { IContactSearchResult } from '@/interfaces';
import { ApiGen_Concepts_PersonOrganization } from '@/models/api/generated/ApiGen_Concepts_PersonOrganization';
import { formatApiPersonNames } from '@/utils/personUtils';

import { Select, SelectOption } from '../Select';

export interface IPrimaryContactSelectorProps {
  field: string;
  contactInfo?: IContactSearchResult;
  canEditDetails?: boolean;
}

export const PrimaryContactSelector: React.FC<IPrimaryContactSelectorProps> = ({
  field,
  contactInfo,
  canEditDetails,
}) => {
  const { setFieldValue } = useFormikContext<any>();
  const {
    getOrganizationDetail: { execute: fetchOrganization, response: organization },
  } = useOrganizationRepository();

  React.useEffect(() => {
    if (contactInfo?.organizationId) {
      fetchOrganization(contactInfo?.organizationId);
    }
  }, [contactInfo?.organizationId, fetchOrganization]);

  const orgPersons = organization?.organizationPersons;

  React.useEffect(() => {
    if (orgPersons?.length === 0) {
      setFieldValue(field, null);
    }
    if (orgPersons?.length === 1) {
      setFieldValue(field, orgPersons[0].personId);
    }
  }, [field, orgPersons, setFieldValue]);

  const primaryContacts: SelectOption[] =
    orgPersons?.map((orgPerson: ApiGen_Concepts_PersonOrganization) => {
      return {
        label: `${formatApiPersonNames(orgPerson.person)}`,
        value: orgPerson.personId ?? '',
      };
    }) ?? [];

  const editEnabled = canEditDetails ?? true;

  if (contactInfo?.organizationId && !contactInfo?.personId) {
    return primaryContacts.length > 1 ? (
      <Select
        options={primaryContacts}
        field={field}
        placeholder="Select a primary contact"
        disabled={!editEnabled}
      />
    ) : primaryContacts.length > 0 ? (
      <span>{primaryContacts[0].label}</span>
    ) : (
      <span>No contacts available</span>
    );
  }

  // primary contacts only make sense for organizations
  return null;
};
