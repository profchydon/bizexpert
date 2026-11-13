import { createSlice } from "@reduxjs/toolkit";

export interface Util {}

const initialState: Util = {};

export const utilSlice = createSlice({
  name: "utilSlice",
  initialState,
  reducers: {},
});

export const {} = utilSlice.actions;

export default utilSlice.reducer;
