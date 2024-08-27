export type TInventoryTransaction = {
  id: number;
  name: string;
  date: Date;
  type: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
};

export type TInventoryTransactionRequestObject = {
  date: Date;
  name: string;
  type: string;
  stock: number;
  inventoryId: string;
};
