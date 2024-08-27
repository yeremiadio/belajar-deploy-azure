import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen, renderHook } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useForm } from 'react-hook-form';
import { configureStore } from '@reduxjs/toolkit';

import { TPurchaseOrderRequestFormObject } from '@/types/api/order';

import purchaseOrderSlice from '@/stores/purchaseOrderStore/purchaseOrderSlice';
// import AddInventoryForm from '@/pages/PurchaseOrder/PurchaseOrderCreate/_components/AddInventoryForm';
import { inventoryListDummyData } from '@/utils/dummies/purchaseOrder/purchaseOrderDummy';

vi.mock('@/utils/hooks/selectOptions/useInventoryOptions', () => ({
  default: () => ({
    data: [
      {
        label: 'Item 1',
        value: 1,
        inventory: inventoryListDummyData[0],
      },
      {
        label: 'Item 2',
        value: 2,
        inventory: inventoryListDummyData[1],
      },
    ],
  }),
}));

vi.mock('@/utils/functions/convertNumberToStringRupiah', () => ({
  default: (value: string) => `Rp ${value}`,
}));

const { result } = renderHook(() =>
  useForm<TPurchaseOrderRequestFormObject>({
    defaultValues: {
      // customer: '',
      address: '',
      groupInventoryId: undefined,
      deliveryDate: undefined,
      termsId: undefined,
      status: undefined,
      inventoryList: [],
      tax: 0,
      discount: 0,
    },
  }),
);
// @ts-ignore
const mockFormObject = result.current;

describe.skip('Add Inventory Form', () => {
  // @ts-ignore
  const toggleMock = vi.fn();

  beforeEach(() => {
    let store = configureStore({
      reducer: {
        order: purchaseOrderSlice,
      },
    });

    render(
      <Provider store={store}>
        <Router>
          {/* <AddInventoryForm toggle={toggleMock} formObject={mockFormObject} /> */}
        </Router>
      </Provider>,
    );
  });

  it.skip('renders form fields and elements correctly', () => {
    expect(screen.getByText('Inventory ID - Name')).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(screen.getByText('Unit')).toBeInTheDocument();
    expect(screen.getByText('Price per Unit')).toBeInTheDocument();
    expect(screen.getByText('Total Price per Product')).toBeInTheDocument();
  });
});
