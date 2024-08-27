import { screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it } from 'vitest';

import { renderWithProviders } from '@/tests/setup';
import TagForm from '@/pages/Management/Tag/_components/Forms/TagForm';

vi.mock('@/components/ui/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

const mockCreateTag = vi.fn(() => ({
  unwrap: () => Promise.resolve({ data: { id: 3, name: 'New Tag' } }),
}));

const mockUpdateTag = vi.fn(() => ({
  unwrap: () => Promise.resolve({ data: { id: 3, name: 'Updated Tag' } }),
}));

vi.mock('@/stores/managementStore/tagStore/tagStoreApi', () => ({
  useCreateTagMutation: () => [mockCreateTag],
  useUpdateTagMutation: () => [mockUpdateTag],
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('TagForm component', () => {
  it('should submit the form with valid data for creating a tag', async () => {
    const mockToggle = vi.fn();
    await act(async () => {
      renderWithProviders(<TagForm toggle={mockToggle} />);
    });
    const addButton = screen.getByText('Add Tag');
    const input = screen.getByLabelText('tagDevice');

    await act(async () => {
      await userEvent.type(input, 'New Tag');
    });

    await act(async () => {
      userEvent.click(addButton);
    });

    await waitFor(() => {
      expect(mockCreateTag).toHaveBeenCalledTimes(1);
      expect(mockCreateTag).toHaveBeenCalledWith({
        name: 'New Tag',
        companyId: null,
      });
    });
  });

  it('should submit the form with valid data for updating a tag', async () => {
    const mockToggle = vi.fn();

    act(() => {
      const mockTagData = {
        id: 3,
        name: 'New Tag',
        company: { id: 1, name: 'Test Company' },
        isReseted: true,
        relation: 'reservation1234',
      };
      renderWithProviders(
        <TagForm toggle={mockToggle} isEditing={true} data={mockTagData} />,
      );
    });

    const saveButton = screen.getByText('Edit Tag');
    const input = screen.getByLabelText('tagDevice');

    await act(async () => {
      // Clear the existing value and type a new one
      await userEvent.clear(input);
      await userEvent.type(input, 'Updated Tag');
    });

    await act(async () => {
      userEvent.click(saveButton);
    });
  });
});
