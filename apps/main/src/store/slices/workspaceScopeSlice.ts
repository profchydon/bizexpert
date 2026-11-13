import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WorkspaceScopeState {
  activeScopeId: string | null;
  activeEntityId: string | null;
}

const initialState: WorkspaceScopeState = {
  activeScopeId: null,
  activeEntityId: null,
};

const workspaceScopeSlice = createSlice({
  name: "workspaceScope",
  initialState,
  reducers: {
    setWorkspaceScope: (state, action: PayloadAction<WorkspaceScopeState>) => {
      state.activeScopeId = action.payload.activeScopeId;
      state.activeEntityId = action.payload.activeEntityId;
    },
    clearWorkspaceScope: (state) => {
      state.activeScopeId = null;
      state.activeEntityId = null;
    },
  },
});

export const { setWorkspaceScope, clearWorkspaceScope } =
  workspaceScopeSlice.actions;

export default workspaceScopeSlice.reducer;
