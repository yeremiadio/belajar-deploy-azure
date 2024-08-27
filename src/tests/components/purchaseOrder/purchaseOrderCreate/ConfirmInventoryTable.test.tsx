import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import purchaseOrderSlice from '@/stores/purchaseOrderStore/purchaseOrderSlice';
// import ConfirmInventoryTable from '@/pages/PurchaseOrder/PurchaseOrderCreate/_components/ConfirmInventoryTable';

describe.skip('Confirm Inventory Table', () => {
  beforeEach(() => {
    let store = configureStore({
      reducer: {
        order: purchaseOrderSlice,
      },
    });

    render(
      <Provider store={store}>
        <Router>
          {/* <ConfirmInventoryTable
          formObject={}
          /> */}
        </Router>
      </Provider>,
    );
  });

  it.skip('renders confirm inventory table', () => {
    const tableElement = screen.getByRole('table', {
      name: 'confirmInventoryTable',
    });
    expect(tableElement).toBeInTheDocument();
  });

  it.skip('renders confirm inventory table headers', () => {
    const headers = [
      'Inventory',
      'Required',
      'In Stock',
      'Ready',
      'Gap',
      'Stock Status',
    ];
    headers.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });
});
