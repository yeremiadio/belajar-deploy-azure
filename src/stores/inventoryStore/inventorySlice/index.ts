import { RootState } from "@/stores";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isModalViewOpen: false,
};

export const inventorySlice = createSlice({
    name: "INVENTORY_SLICE",
    initialState,
    reducers: {
        toggleModalView: (state) => {
            state.isModalViewOpen = !state.isModalViewOpen;
        },
        toggleOpenModalView: (state) => {
            state.isModalViewOpen = true;
        },
    },
});

export const { toggleModalView, toggleOpenModalView } = inventorySlice.actions;

export const modalViewInventoryOpen = (state: RootState) =>
    state.inventorySlice.isModalViewOpen;

export default inventorySlice.reducer;
