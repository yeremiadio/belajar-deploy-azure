import { IInventory } from '@/types/api/management/inventory';
import {
  PaymentTermsEnum,
  OrderStatusEnum,
  TInventoryItem,
} from '@/types/api/order';
import { TOrderDocument } from '@/types/api/order/orderDocument';

export const purchaseOrderDummyData: any = [
  {
    id: 1,
    orderId: 'PC1203',
    address: 'Jl HR. Muhammad No 18',
    groupInventoryId: 2,
    deliveryDate: new Date('2024-03-18T01:38:14.310Z'),
    termsId: PaymentTermsEnum.COD,
    status: OrderStatusEnum.CONFIRMED,
    inventoryList: [
      {
        id: 25,
        quantity: 2,
        inventory: {
          id: 10,
          createdAt: '2024-05-03T11:20:44.573Z',
          updatedAt: '2024-05-07T13:27:02.639Z',
          deletedAt: null,
          name: 'Etanol',
          uniqueId: 'NPX-02',
          companyId: 39,
          type: 'chemical',
          unit: 'Kg',
          price: 345000,
          stock: 1917,
          group: [
            {
              id: 28,
              name: 'BCA Private',
              isShow: true,
              price: 200000,
            },
            {
              id: 31,
              name: 'Exclusive',
              isShow: true,
              price: 123000,
            },
          ],
          company: {
            id: 39,
            name: 'PT. Backend Development',
            description: '',
            created_at: '2024-04-25T08:09:14.311Z',
            updated_at: '2024-04-25T08:09:14.311Z',
            modules: [],
            moduleIds: [],
            permission: {
              dashboard: [],
              management: [],
              other: [],
              inventory: [],
              reservation: [],
            },
          },
        },
      },
    ],
    tax: 10,
    discount: 0,
    total: 100000,
    vendorId: 1,
    companyId: 1,
    createdAt: new Date('2024-03-18T01:38:14.310Z'),
    updatedAt: new Date('2024-03-18T01:38:14.310Z'),
  },
];

export const orderDocumentDummyData: TOrderDocument[] = [
  {
    id: 1,
    documentLabel: 'Sample Document 1',
    annotation: 'This is a sample annotation 1.',
    file: new File(['content'], 'sample1.txt'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    documentLabel: 'Sample Document 2',
    annotation: 'This is a sample annotation 2.',
    file: new File(['content'], 'sample2.txt'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const inventoryListDummyData: TInventoryItem<IInventory>[] = [
  {
    id: 1,
    quantity: 10,
    inventory: {
      id: 10,
      createdAt: '2024-05-03T11:20:44.573Z',
      updatedAt: '2024-05-07T13:27:02.639Z',
      deletedAt: null,
      name: 'Etanol',
      uniqueId: 'NPX-02',
      companyId: 39,
      type: 'chemical',
      unit: 'Kg',
      price: 34500,
      stock: 500,
      group: [
        {
          id: 28,
          name: 'BCA Private',
          isShow: true,
          price: 20000,
        },
        {
          id: 31,
          name: 'Exclusive',
          isShow: true,
          price: 12300,
        },
      ],
      company: {
        id: 39,
        name: 'PT. Backend Development',
        description: '',
        created_at: '2024-04-25T08:09:14.311Z',
        updated_at: '2024-04-25T08:09:14.311Z',
        modules: [],
        moduleIds: [],
        permission: {
          dashboard: [],
          management: [],
          other: [],
          inventory: [],
          reservation: [],
        },
      },
    },
  },
  {
    id: 2,
    quantity: 30,
    inventory: {
      id: 11,
      createdAt: '2024-05-03T11:20:44.573Z',
      updatedAt: '2024-05-07T13:27:02.639Z',
      deletedAt: null,
      name: 'Aftur',
      uniqueId: 'AFT-01',
      companyId: 39,
      type: 'chemical',
      unit: 'Kg',
      price: 50000,
      stock: 1000,
      group: [
        {
          id: 28,
          name: 'BCA Private',
          isShow: true,
          price: 30000,
        },
        {
          id: 31,
          name: 'Exclusive',
          isShow: true,
          price: 20000,
        },
      ],
      company: {
        id: 39,
        name: 'PT. Backend Development',
        description: '',
        created_at: '2024-04-25T08:09:14.311Z',
        updated_at: '2024-04-25T08:09:14.311Z',
        modules: [],
        moduleIds: [],
        permission: {
          dashboard: [],
          management: [],
          other: [],
          inventory: [],
          reservation: [],
        },
      },
    },
  },
];
