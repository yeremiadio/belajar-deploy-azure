import { describe, it, vi, Mock } from 'vitest';
import { screen, fireEvent, waitFor, render } from '@testing-library/react';

import ToolbarAction from '@/pages/PurchaseOrder/PurchaseOrderList/_components/ToolbarAction';

describe.skip('Purchase Toolbar Action', () => {
  const setSearchKeywordMock = vi.fn();
  const handleCreateOrderMock = vi.fn();

  beforeEach(() => {
    render(
      <ToolbarAction
        searchKeyword=""
        setSearchKeyword={setSearchKeywordMock}
        handleCreateOrder={handleCreateOrderMock}
      />,
    );
  });

  vi.mock(`react-router-dom`, async (): Promise<unknown> => {
    const actual: Record<string, unknown> =
      await vi.importActual(`react-router-dom`);

    return {
      ...actual,
      useNavigate: (): Mock => handleCreateOrderMock,
    };
  });

  it.skip('triggers navigation on purchase order item click', async () => {
    const createOrderButton = screen.getByText('Create New Order');
    fireEvent.click(createOrderButton);

    await waitFor(() => {
      expect(handleCreateOrderMock).toHaveBeenCalled();
    });
  });

  it.skip('calls setSearchKeyword function with correct value when search input changes', async () => {
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(setSearchKeywordMock).toHaveBeenCalledWith('test');
  });

  it.skip('renders search input field and create order button correctly', () => {
    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toBeInTheDocument();

    const createOrderButton = screen.getByText('Create New Order');
    expect(createOrderButton).toBeInTheDocument();
  });
});
