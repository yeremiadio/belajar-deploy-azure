import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';

import { inventoryListDummyData as inventoryList } from '@/utils/dummies/purchaseOrder/purchaseOrderDummy';

import useCalculateOrderProduct from '@/utils/functions/order/useCalculateOrderProduct';

describe('useCalculateOrderProduct hook', () => {
  it('calculates the subtotal correctly', () => {
    const { result } = renderHook(() =>
      useCalculateOrderProduct({ products: inventoryList }),
    );
    expect(result.current.subTotal).toBe(34500 * 10 + 50000 * 30); // 1715000
  });

  it('calculates the tax correctly', () => {
    const { result } = renderHook(() =>
      useCalculateOrderProduct({ tax: 10, products: inventoryList }),
    );
    expect(result.current.totalTax).toBe(0.1 * (34500 * 10 + 50000 * 30)); // 171500
  });

  it('calculates the discount correctly', () => {
    const { result } = renderHook(() =>
      useCalculateOrderProduct({ discount: 10, products: inventoryList }),
    );
    expect(result.current.totalDiscount).toBe(0.1 * (34500 * 10 + 50000 * 30)); // 171500
  });

  it('calculates the total correctly', () => {
    const { result } = renderHook(() =>
      useCalculateOrderProduct({
        tax: 10,
        discount: 10,
        products: inventoryList,
      }),
    );
    expect(result.current.total).toBe(
      34500 * 10 +
        50000 * 30 +
        0.1 * (34500 * 10 + 50000 * 30) -
        0.1 * (34500 * 10 + 50000 * 30),
    ); // 1715000
  });

  it('returns zero discount if discount is out of range', () => {
    const { result } = renderHook(() =>
      useCalculateOrderProduct({
        discount: 101,
        products: inventoryList,
      }),
    );
    expect(result.current.totalDiscount).toBe(0);
  });

  it('returns zero tax if tax is out of range', () => {
    const { result } = renderHook(() =>
      useCalculateOrderProduct({
        tax: -1,
        products: inventoryList,
      }),
    );
    expect(result.current.totalTax).toBe(0);
  });
});
