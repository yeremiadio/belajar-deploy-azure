import { OrderStatusEnum } from '@/types/api/order';

const getStatusPermissions = (status: string) => {
  switch (status) {
    case OrderStatusEnum.QUOTATION:
      return {
        canChangeVendor: {
          vendor: false,
          address: false,
          pricelist: false,
          deliveryDate: true,
          terms: false,
          status: true,
        },
        canChangeInventory: false,
        canChangeDocument: true,
        canChangeDelivery: true,
      };
    case OrderStatusEnum.IN_CONFIRMATION:
    case OrderStatusEnum.CONFIRMED:
    case OrderStatusEnum.IN_PRODUCTION:
    case OrderStatusEnum.DELIVERY_READY:
      return {
        canChangeVendor: {
          vendor: false,
          address: false,
          pricelist: false,
          deliveryDate: true,
          terms: false,
          status: true,
        },
        canChangeInventory: false,
        canChangeDocument: true,
        canChangeDelivery: true,
      };
    case OrderStatusEnum.COMPLETE:
      return {
        canChangeVendor: {
          vendor: false,
          address: false,
          pricelist: false,
          terms: false,
          deliveryDate: false,
          status: false,
        },
        canChangeInventory: false,
        canChangeDocument: false,
        canChangeDelivery: false,
      };
    default:
      return {
        canChangeVendor: {
          vendor: true,
          address: true,
          pricelist: true,
          terms: true,
          deliveryDate: true,
          status: false,
        },
        canChangeInventory: true,
        canChangeDocument: true,
        canChangeDelivery: true,
      };
  }
};

export default getStatusPermissions;
