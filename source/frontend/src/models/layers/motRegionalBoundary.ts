// Ministry of Transportation (MOT) Regional Boundary
// Source : https://catalogue.data.gov.bc.ca/dataset/ministry-of-transportation-mot-regional-boundary
// Api: WHSE_ADMIN_BOUNDARIES.TADM_MOT_REGIONAL_BNDRY_POLY
export interface MOT_RegionalBoundary_Feature_Properties {
  readonly REGION_NUMBER: number | null;
  readonly FEATURE_CODE: string | null;
  readonly REGION_NAME: string | null;
  readonly OBJECTID: number | null;
  readonly SE_ANNO_CAD_DATA: Blob | null;
  readonly FEATURE_AREA_SQM: number | null;
  readonly FEATURE_LENGTH_M: number | null;
}