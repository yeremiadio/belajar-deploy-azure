import { useMemo } from 'react';

import { IInventory } from '@/types/api/management/inventory';
import { TInventoryItem } from '@/types/api/order';

type Props = {
  tax?: number;
  discount?: number;
  products: TInventoryItem<IInventory>[];
};

type ReturnValue = {
  totalTax: number;
  totalDiscount: number;
  subTotal: number;
  total: number;
};

const useCalculateOrderProduct = ({
  tax = 0,
  discount = 0,
  products,
}: Props): ReturnValue => {
  const calculateSubtotal = useMemo<number>(() => {
    const subtotal = products.reduce((sum, item) => {
      if (
        !item.inventory?.price ||
        !item.quantity ||
        item.quantity < 0 ||
        item.inventory.price < 0
      )
        return sum;
      return sum + item.inventory.price * item.quantity;
    }, 0);
    return subtotal;
  }, [products]);

  const calculateTax = useMemo<number>(() => {
    if (tax < 0 || tax > 100) return 0;
    return (tax / 100) * calculateSubtotal;
  }, [tax, calculateSubtotal]);

  const calculateDiscount = useMemo<number>(() => {
    if (discount < 0 || discount > 100) return 0;
    return (discount / 100) * calculateSubtotal;
  }, [discount, calculateSubtotal]);

  const calculateTotal = useMemo<number>(() => {
    return calculateSubtotal - calculateDiscount + calculateTax;
  }, [calculateSubtotal, calculateTax, calculateDiscount]);

  return {
    subTotal: calculateSubtotal,
    totalTax: calculateTax,
    totalDiscount: calculateDiscount,
    total: calculateTotal,
  };
};

export default useCalculateOrderProduct;
