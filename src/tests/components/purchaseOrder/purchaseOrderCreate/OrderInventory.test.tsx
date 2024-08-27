import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen, renderHook } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useForm } from 'react-hook-form';
import { configureStore } from '@reduxjs/toolkit';

import { TPurchaseOrderRequestFormObject } from '@/types/api/order';

import purchaseOrderSlice from '@/stores/purchaseOrderStore/purchaseOrderSlice';
// import OrderInventory from '@/pages/PurchaseOrder/PurchaseOrderCreate/_components/OrderInventory';

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

describe.skip('Order Inventory Page', () => {
  beforeEach(() => {
    let store = configureStore({
      reducer: {
        order: purchaseOrderSlice,
      },
    });

    render(
      <Provider store={store}>
        <Router>{/* <OrderInventory formObject={mockFormObject} /> */}</Router>
      </Provider>,
    );
  });

  it.skip('renders order inventory table', () => {
    const tableElement = screen.getByRole('table', {
      name: 'orderInventoryTable',
    });
    expect(tableElement).toBeInTheDocument();
  });

  it.skip('renders order inventory table headers', () => {
    const headers = [
      'Inventory ID',
      'Inventory Name',
      'Quantity',
      'Unit',
      'Price per Unit',
      'Total Price',
    ];
    headers.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it('renders "No Inventory Selected" when inventoryList is empty', () => {
    const noInventoryMessage = screen.getByText('No Inventory Selected');
    expect(noInventoryMessage).toBeInTheDocument();
  });

  it('renders order document table', () => {
    const tableElement = screen.getByRole('table', {
      name: 'orderDocumentTable',
    });
    expect(tableElement).toBeInTheDocument();
  });
});
