/**
 * File autogenerated by TsGenerator.
 * Do not manually modify, changes made to this file will be lost when this file is regenerated.
 */
import { UtcIsoDateTime } from '@/models/api/UtcIsoDateTime';

import { ApiGen_Mayan_DocumentType } from './ApiGen_Mayan_DocumentType';
import { ApiGen_Mayan_FileLatest } from './ApiGen_Mayan_FileLatest';

// LINK: @backend/apimodels/Models/Mayan/Document/DocumentDetailModel.cs
export interface ApiGen_Mayan_DocumentDetail {
  id: number;
  label: string | null;
  language: string | null;
  datetime_created: UtcIsoDateTime;
  description: string | null;
  uuid: string | null;
  file_latest: ApiGen_Mayan_FileLatest | null;
  document_type: ApiGen_Mayan_DocumentType | null;
}
