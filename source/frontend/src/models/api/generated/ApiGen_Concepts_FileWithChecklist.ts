/**
 * File autogenerated by TsGenerator.
 * Do not manually modify, changes made to this file will be lost when this file is regenerated.
 */
import { ApiGen_Concepts_File } from './ApiGen_Concepts_File';
import { ApiGen_Concepts_FileChecklistItem } from './ApiGen_Concepts_FileChecklistItem';

// LINK: @backend/apimodels/Models/Concepts/File/FileWithChecklistModel.cs
export interface ApiGen_Concepts_FileWithChecklist extends ApiGen_Concepts_File {
  fileChecklistItems: ApiGen_Concepts_FileChecklistItem[] | null;
}