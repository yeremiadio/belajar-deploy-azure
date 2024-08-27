import { RootState } from "@/stores";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCopilotOpen: false,
};

export const toggleCopilotSlice = createSlice({
  name: "TOGGLE_COPILOT_SLICE",
  initialState,
  reducers: {
    toggleCopilot: (state) => {
      state.isCopilotOpen = !state.isCopilotOpen;
    },
  },
});

export const { toggleCopilot } = toggleCopilotSlice.actions;

export const selectToggleCopilot = (state: RootState) =>
  state.toggleCopilotSlice.isCopilotOpen;

export default toggleCopilotSlice.reducer;
