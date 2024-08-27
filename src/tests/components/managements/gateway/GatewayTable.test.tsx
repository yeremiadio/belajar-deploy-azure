import { describe, it } from 'vitest';

import GatewayPage from '@/pages/Management/Gateway/GatewayPage';
import { renderWithProviders } from '@/tests/setup';
import { initiateServer } from '@/tests/testUtils';
import {
  act,
  fireEvent,
  screen,
} from '@testing-library/react';

describe('Gateway Page with Table', () => {
  initiateServer();

  beforeEach(() => {
    renderWithProviders(<GatewayPage />);
  });

  it('should render GatewayPage with title', () => {
    act(() => {
      expect(screen.getByText('Management Gateway')).toBeInTheDocument();
    });
  });

  it("should render gateway's table", () => {
    act(() => {
      const tableElement = screen.getByRole('table', {
        name: 'gatewayTable',
      });
      expect(tableElement).toBeInTheDocument();
    });
  });

  it('should render "gateway\'s name" column', () => {
    act(() => {
      const statusCol = screen.getByText("Gateway Name");
      expect(statusCol).toBeInTheDocument();
    });
  });

  it('should render "action" column', () => {
    act(() => {
      const statusCol = screen.getByText('Action');
      expect(statusCol).toBeInTheDocument();
    });
  });

  // it('renders action buttons in the action column', async () => {
  //   await waitFor(() => {
  //     const rows = screen.getAllByRole('row');

  //     rows.slice(1).forEach((row) => {
  //       const editGatewayButton = within(row).getByText('Edit Gateway');
  //       const addIngredientsButton = within(row).getByText('Add Ingredients');
  //       const deleteButton = within(row).getByTestId('buttonDeleteGateway');

  //       expect(editGatewayButton).toBeInTheDocument();
  //       expect(addIngredientsButton).toBeInTheDocument();
  //       expect(deleteButton).toBeInTheDocument();

  //       // Simulate button clicks
  //       fireEvent.click(editGatewayButton);
  //       fireEvent.click(addIngredientsButton);
  //       fireEvent.click(deleteButton);
  //     });
  //   });
  // });

  it('should renders "add gateway" button', () => {
    act(() => {
      const addButton = screen.getByText('Add Gateway');
      expect(addButton).toBeInTheDocument();
      fireEvent.click(addButton);
    });
  });

  it('should render Export CSV button', () => {
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
});
