import { screen, fireEvent, within, act } from '@testing-library/react';
import { describe, it } from 'vitest';

import TagManagement from '@/pages/Management/Tag/TagPage';
import { renderWithProviders } from '@/tests/setup';
import { initiateServer } from '@/tests/testUtils';

describe('Tab Page with Table', () => {
  initiateServer();

  vi.mock('@/stores/managementStore/tagStore/tagStoreApi', () => ({
    useGetTagQuery: vi.fn(() => ({
      data: {
        entities: [
          { id: 1, name: 'Tag1', isReseted: true },
          { id: 2, name: 'Tag2', isReseted: false },
        ],
        meta: { totalPages: 1 },
      },
    })),
    useDeleteTagMutation: () => [vi.fn()],
    useResetTagMutation: () => [vi.fn()],
    useCreateTagMutation: () => [vi.fn()],
    useUpdateTagMutation: () => [vi.fn()],
  }));

  beforeEach(() => {
    act(() => {
      renderWithProviders(<TagManagement />);
    });
    vi.clearAllMocks();
  });

  it('should render tag table', () => {
    act(() => {
      const tableElement = screen.getByRole('table', {
        name: 'tagTable',
      });
      expect(tableElement).toBeInTheDocument();
    });
  });

  it('should render tag device column', () => {
    act(() => {
      const statusCol = screen.getByText('Tag Device');
      expect(statusCol).toBeInTheDocument();
    });
  });

  it('should render action column', () => {
    act(() => {
      const statusCol = screen.getByText('Action');
      expect(statusCol).toBeInTheDocument();
    });
  });

  it('should renders Add Tag button', () => {
    act(() => {
      const addButton = screen.getByText('Add Tag');
      expect(addButton).toBeInTheDocument();
      fireEvent.click(addButton);
    });
  });

  it('should render TagPage with title', () => {
    expect(screen.getByText('Management Tag')).toBeInTheDocument();
  });

  it('should render Export CSV button', async () => {
    act(() => {
      const exportButton = screen.getByText('Export to CSV');
      expect(exportButton).toBeInTheDocument();
      fireEvent.click(exportButton);
    });
  });

  it('should render handle search input', () => {
    act(() => {
      const searchInput = screen.getByPlaceholderText(
        'Search...',
      ) as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'test' } });
      expect(searchInput.value).toBe('test');
    });
  });

  it('renders action buttons in the action column', () => {
    act(() => {
      const rows = screen.getAllByRole('row');

      rows.slice(1).forEach((row) => {
        const editButton = within(row).getByText('Edit');
        const deleteButton = within(row).getByTestId('buttonDeleteTag');
        const resetButton = within(row).getByText('Reset');

        expect(editButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();
        expect(resetButton).toBeInTheDocument();

        // Simulate button clicks
        fireEvent.click(editButton);
        fireEvent.click(deleteButton);
        fireEvent.click(resetButton);
      });
    });
  });
});
