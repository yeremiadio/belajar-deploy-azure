import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/stores';

interface RapidsenseHtmlState {
  htmlRefId: string | null;
}

const initialState: RapidsenseHtmlState = {
  htmlRefId: null,
};

export const rapidsenseHtmlSlice = createSlice({
  name: 'rapidsenseHtml',
  initialState,
  reducers: {
    setHtmlRefId: (state, action) => {
      state.htmlRefId = action.payload;
    },
  },
});

export const { setHtmlRefId } = rapidsenseHtmlSlice.actions;

export const selectHtmlRefId = (state: RootState) => state.rapidsenseHtml.htmlRefId;

export default rapidsenseHtmlSlice.reducer;