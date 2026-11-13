import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface AuthDataState {
  authData?: string | null;
}

const initialState: AuthDataState = {
  authData: null,
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setEncryptAuth: (state, action: PayloadAction<string>) => {
      state.authData = action.payload;
    },

    unsetAuth: (state) => {
      state.authData = null;
    },
  },
});

export const { unsetAuth, setEncryptAuth } = authSlice.actions;

export default authSlice.reducer;
