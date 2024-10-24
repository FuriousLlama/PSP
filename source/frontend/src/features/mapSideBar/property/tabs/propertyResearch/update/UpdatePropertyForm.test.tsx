import { Formik } from 'formik';
import { createMemoryHistory } from 'history';
import noop from 'lodash/noop';

import { mockLookups } from '@/mocks/lookups.mock';
import { ApiGen_Concepts_ResearchFileProperty } from '@/models/api/generated/ApiGen_Concepts_ResearchFileProperty';
import { lookupCodesSlice } from '@/store/slices/lookupCodes';
import { render, RenderOptions } from '@/utils/test-utils';

import { UpdatePropertyFormModel } from './models';
import UpdatePropertyForm from './UpdatePropertyForm';
import { getEmptyBaseAudit } from '@/models/defaultInitializers';

const testResearchFile: ApiGen_Concepts_ResearchFileProperty = {
  id: 1,
  propertyName: 'Corner of Nakya PL ',
  propertyId: 495,

  propertyResearchPurposeTypes: [
    {
      id: 22,
      propertyResearchPurposeTypeCode: {
        id: 'FORM12',
        description: 'Form 12',
        isDisabled: false,
        displayOrder: null,
      },
      rowVersion: 1,
      ...getEmptyBaseAudit(),
    },
    {
      id: 23,
      propertyResearchPurposeTypeCode: {
        id: 'DOTHER',
        description: 'District Other',
        isDisabled: false,
        displayOrder: null,
      },
      rowVersion: 1,
      ...getEmptyBaseAudit(),
    },
  ],
  rowVersion: 10,
  isLegalOpinionRequired: null,
  isLegalOpinionObtained: null,
  documentReference: null,
  researchSummary: null,
  file: null,
  displayOrder: null,
  property: null,
  location: null,
  fileId: 0,
};

const history = createMemoryHistory();
const storeState = {
  [lookupCodesSlice.name]: { lookupCodes: mockLookups },
};

describe('UpdatePropertyForm component', () => {
  const setup = (renderOptions: RenderOptions & { initialValues: UpdatePropertyFormModel }) => {
    // render component under test
    const component = render(
      <Formik onSubmit={noop} initialValues={renderOptions.initialValues}>
        {formikProps => <UpdatePropertyForm formikProps={formikProps} />}
      </Formik>,
      {
        ...renderOptions,
        store: storeState,
        history,
      },
    );

    return {
      component,
    };
  };

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders as expected when provided no research file', () => {
    const initialValues = UpdatePropertyFormModel.fromApi(testResearchFile);
    const { component } = setup({ initialValues });
    expect(component.asFragment()).toMatchSnapshot();
  });
});
