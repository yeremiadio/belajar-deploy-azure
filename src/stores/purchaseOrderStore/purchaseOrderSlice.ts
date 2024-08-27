import { TInventoryItem, TOrder } from '@/types/api/order';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/stores';
import { IInventory } from '@/types/api/management/inventory';

interface TOrderSlice {
  inventoryList: TInventoryItem<IInventory>[];
  readyValues: { [key: string]: number };
}

const initialState: TOrderSlice = {
  // customer: '',
  // address: '',
  // groupInventoryId: undefined,
  // deliveryDate: undefined,
  // termsId: undefined,
  // status: undefined,
  inventoryList: [],
  // tax: 0,
  // discount: 0,
  readyValues: {},
};

const purchaseOrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: () => initialState,
    updateOrder: (state, action: PayloadAction<Partial<TOrder>>) => {
      return { ...state, ...action.payload };
    },
    pushInventory: (
      state,
      action: PayloadAction<TInventoryItem<IInventory>>,
    ) => {
      state.inventoryList.push(action.payload);
    },
    removeInventory: (state, action: PayloadAction<number>) => {
      state.inventoryList = state.inventoryList.filter(
        (item) => item.id !== action.payload,
      );
    },
    updateReadyValues: (
      state,
      action: PayloadAction<{ [key: string]: number }>,
    ) => {
      state.readyValues = { ...state.readyValues, ...action.payload };
    },
  },
});

export const {
  resetOrder,
  updateOrder,
  pushInventory,
  removeInventory,
  updateReadyValues,
} = purchaseOrderSlice.actions;

export const selectOrder = (state: RootState) => state.order;

export default purchaseOrderSlice.reducer;
