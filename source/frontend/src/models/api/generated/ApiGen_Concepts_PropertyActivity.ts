/**
 * File autogenerated by TsGenerator.
 * Do not manually modify, changes made to this file will be lost when this file is regenerated.
 */
import { ApiGen_Base_BaseAudit } from './ApiGen_Base_BaseAudit';
import { ApiGen_Base_CodeType } from './ApiGen_Base_CodeType';
import { ApiGen_Concepts_Organization } from './ApiGen_Concepts_Organization';
import { ApiGen_Concepts_Person } from './ApiGen_Concepts_Person';
import { ApiGen_Concepts_PropertyActivityInvoice } from './ApiGen_Concepts_PropertyActivityInvoice';
import { ApiGen_Concepts_PropertyActivityInvolvedParty } from './ApiGen_Concepts_PropertyActivityInvolvedParty';
import { ApiGen_Concepts_PropertyActivityProperty } from './ApiGen_Concepts_PropertyActivityProperty';
import { ApiGen_Concepts_PropertyMinistryContact } from './ApiGen_Concepts_PropertyMinistryContact';

// LINK: @backend/apimodels/Models/Concepts/Property/PropertyActivityModel.cs
export interface ApiGen_Concepts_PropertyActivity extends ApiGen_Base_BaseAudit {
  id: number;
  activityTypeCode: ApiGen_Base_CodeType<string> | null;
  activitySubtypeCode: ApiGen_Base_CodeType<string> | null;
  activityStatusTypeCode: ApiGen_Base_CodeType<string> | null;
  requestAddedDateTime: string;
  completionDateTime: string | null;
  description: string | null;
  requestSource: string | null;
  pretaxAmt: number | null;
  gstAmt: number | null;
  pstAmt: number | null;
  totalAmt: number | null;
  isDisabled: boolean | null;
  serviceProviderOrgId: number | null;
  serviceProviderOrg: ApiGen_Concepts_Organization | null;
  serviceProviderPersonId: number | null;
  serviceProviderPerson: ApiGen_Concepts_Person | null;
  involvedParties: ApiGen_Concepts_PropertyActivityInvolvedParty[] | null;
  ministryContacts: ApiGen_Concepts_PropertyMinistryContact[] | null;
  activityProperties: ApiGen_Concepts_PropertyActivityProperty[] | null;
  invoices: ApiGen_Concepts_PropertyActivityInvoice[] | null;
}