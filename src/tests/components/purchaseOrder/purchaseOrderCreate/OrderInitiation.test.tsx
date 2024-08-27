import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, renderHook } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import { TPurchaseOrderRequestFormObject } from '@/types/api/order';

// import OrderInitiation from '@/pages/PurchaseOrder/PurchaseOrderCreate/_components/OrderInitiation';
import { setupStore } from '@/stores/index.ts';

vi.mock('@/utils/hooks/selectOptions/useOrderStatusOptions', () => ({
  default: () => ({ data: [{ id: 1, label: 'confirm' }] }),
}));

vi.mock('@/utils/hooks/selectOptions/useOrderTermsOptions', () => ({
  default: () => ({ data: [{ id: 1, label: 'transfer' }] }),
}));

vi.mock('@/utils/hooks/selectOptions/useInventoryGroupOptions', () => ({
  default: () => ({ data: [{ id: 1, label: 'Exclusive' }] }),
}));

vi.mock('@/stores/purchaseOrderStore/purchaseOrderApi', () => ({
  useGetPurchaseOrderByIdQuery: () => ({ data: null }),
}));

vi.mock('react-hook-form', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('react-hook-form')>()),
  };
});

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

describe.skip('Order Initiation Form', () => {
  let store;

  beforeEach(() => {
    store = setupStore();

    render(
      <Provider store={store}>
        <Router>{/* <OrderInitiation formObject={mockFormObject} /> */}</Router>
      </Provider>,
    );
  });

  it.skip('renders order initiation form', () => {
    expect(screen.getByText('Customer')).toBeInTheDocument();
  });

  it.skip('renders form fields and elements correctly', () => {
    expect(screen.getByPlaceholderText('Customer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Address')).toBeInTheDocument();
    expect(document.getElementById('pricelistSelect')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Select Date')).toBeInTheDocument();
    expect(document.getElementById('termsSelect')).toBeInTheDocument();
    expect(document.getElementById('statusSelect')).toBeInTheDocument();
  });
});
