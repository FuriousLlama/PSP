import { AxiosResponse } from 'axios';

import { ApiGen_Concepts_FileProperty } from '@/models/api/generated/ApiGen_Concepts_FileProperty';

import { IResponseWrapper } from '../util/useApiRequestWrapper';

export interface IFilePropertyRepositoryMethods {
  getProperties: IResponseWrapper<
    (fileId: number) => Promise<AxiosResponse<ApiGen_Concepts_FileProperty[], any>>
  >;
}

export type IFilePropertyRepository = () => IFilePropertyRepositoryMethods;
