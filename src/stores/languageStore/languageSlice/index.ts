import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/stores";

interface LanguageState {
  lang: string;
}

const initialState: LanguageState = {
  lang: "en",
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.lang = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;

export const selectLanguage = (state: RootState) => state.language.lang;

export default languageSlice.reducer;
