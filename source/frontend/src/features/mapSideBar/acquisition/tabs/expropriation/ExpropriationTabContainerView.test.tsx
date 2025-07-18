import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';

import { EnumAcquisitionFileType } from '@/constants/acquisitionFileType';
import Claims from '@/constants/claims';
import { useAcquisitionProvider } from '@/hooks/repositories/useAcquisitionProvider';
import { useExpropriationEventRepository } from '@/hooks/repositories/useExpropriationEventRepository';
import { useInterestHolderRepository } from '@/hooks/repositories/useInterestHolderRepository';
import { getMockExpropriationFile } from '@/mocks/index.mock';
import {
  act,
  getMockRepositoryObj,
  render,
  RenderOptions,
  waitFor,
  within,
} from '@/utils/test-utils';

import {
  ExpropriationTabContainerView,
  IExpropriationTabContainerViewProps,
} from './ExpropriationTabContainerView';
import { useApiContacts } from '@/hooks/pims-api/useApiContacts';
import { getMockContactOrganizationWithOnePerson } from '@/mocks/contacts.mock';
import { useGenerateExpropriationForm1 } from '../../common/GenerateForm/hooks/useGenerateExpropriationForm1';

const history = createMemoryHistory();

vi.mock('@/hooks/repositories/useExpropriationEventRepository');
const mockGetExpropriationEventsApi = getMockRepositoryObj([]);
const mockAddExpropriationEventsApi = getMockRepositoryObj();
const mockUpdateExpropriationEventsApi = getMockRepositoryObj();
const mockDeleteExpropriationEventsApi = getMockRepositoryObj();

vi.mock('@/hooks/repositories/useAcquisitionProvider');
const mockGetAcquisitionOwnersApi = getMockRepositoryObj([]);

vi.mock('@/hooks/repositories/useInterestHolderRepository');
const mockGetAcquisitionInterestHoldersApi = getMockRepositoryObj([]);

vi.mock('@/hooks/pims-api/useApiContacts');
const getContacts = vi.fn();
vi.mocked(useApiContacts).mockReturnValue({
  getContacts,
} as unknown as ReturnType<typeof useApiContacts>);

const onGenerateForm1 = vi.fn();
vi.mock('../../common/GenerateForm/hooks/useGenerateExpropriationForm1');
vi.mocked(useGenerateExpropriationForm1).mockReturnValue({
  onGenerateForm1,
} as unknown as ReturnType<typeof useGenerateExpropriationForm1>);

const onError = vi.fn();

describe('Expropriation Tab Container View', () => {
  const setup = async (
    renderOptions: RenderOptions & { props?: Partial<IExpropriationTabContainerViewProps> } = {},
  ) => {
    const rendered = render(
      <ExpropriationTabContainerView
        {...renderOptions.props}
        loading={renderOptions.props?.loading ?? false}
        acquisitionFile={renderOptions.props?.acquisitionFile ?? getMockExpropriationFile()}
        form8s={renderOptions.props?.form8s ?? []}
        onForm8Deleted={vi.fn()}
        isFileFinalStatus={renderOptions?.props?.isFileFinalStatus ?? false}
      />,
      {
        ...renderOptions,
        useMockAuthentication: true,
        claims: renderOptions?.claims ?? [Claims.ACQUISITION_EDIT],
        history: history,
      },
    );
    await act(async () => {});
    return {
      ...rendered,
      getNatureOfInterestForm1: () =>
        rendered.container.querySelector(`input[name="landInterest"]`) as HTMLInputElement,
      getPurposeForm1: () =>
        rendered.container.querySelector(`input[name="purpose"]`) as HTMLInputElement,
    };
  };

  beforeEach(() => {
    vi.mocked(useExpropriationEventRepository, { partial: true }).mockReturnValue({
      getExpropriationEvents: mockGetExpropriationEventsApi,
      addExpropriationEvent: mockAddExpropriationEventsApi,
      updateExpropriationEvent: mockUpdateExpropriationEventsApi,
      deleteExpropriationEvent: mockDeleteExpropriationEventsApi,
    });

    const organization = getMockContactOrganizationWithOnePerson();
    getContacts.mockResolvedValue({
      data: {
        items: [organization],
        quantity: 1,
        total: 1,
        page: 1,
        pageIndex: 0,
      },
    });

    vi.mocked(useAcquisitionProvider, { partial: true }).mockReturnValue({
      getAcquisitionOwners: mockGetAcquisitionOwnersApi,
    });
    vi.mocked(useInterestHolderRepository, { partial: true }).mockReturnValue({
      getAcquisitionInterestHolders: mockGetAcquisitionInterestHoldersApi,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('displays a loading spinner when loading', async () => {
    const { getByTestId } = await setup({ props: { loading: true } });
    const spinner = getByTestId('filter-backdrop-loading');
    expect(spinner).toBeVisible();
  });

  it('shows the sections for Acquisition file type "Section 6"', async () => {
    const { queryByTestId } = await setup({});
    expect(queryByTestId('form-1-section')).toBeInTheDocument();
    expect(queryByTestId('form-5-section')).toBeInTheDocument();
    expect(queryByTestId('form-8-section')).toBeInTheDocument();
    expect(queryByTestId('form-9-section')).toBeInTheDocument();
  });

  it('shows the sections for Acquisition file type "Section 3"', async () => {
    const { queryByTestId } = await setup({
      props: { acquisitionFile: getMockExpropriationFile(EnumAcquisitionFileType.SECTN3) },
    });

    expect(queryByTestId('form-1-section')).not.toBeInTheDocument();
    expect(queryByTestId('form-5-section')).not.toBeInTheDocument();
    expect(queryByTestId('form-8-section')).toBeInTheDocument();
    expect(queryByTestId('form-9-section')).not.toBeInTheDocument();
  });

  it('displays tooltip instead of add button when file in final status', async () => {
    const { queryByTestId, queryByText } = await setup({
      props: {
        acquisitionFile: getMockExpropriationFile(EnumAcquisitionFileType.SECTN3),
        isFileFinalStatus: true,
      },
    });

    expect(queryByText('Add Form 8')).toBeNull();
    expect(queryByTestId('tooltip-icon-deposit-notes-cannot-edit-tooltip')).toBeVisible();
  });
});
