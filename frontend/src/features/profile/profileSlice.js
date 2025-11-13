import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: {},
    pendingUsers: [],
    admin: false,
    boards:[],
    trashBoards: [],
  },
  reducers: {
    setProfile: (state, action) => {
      state.user = action.payload; // ✅ works perfectly
    },
    setPendingUsers: (state, action) => {
      state.pendingUsers = action.payload; // ✅ works perfectly
    },
    setAdmin: (state, action) => {
      state.admin = action.payload; // ✅ works perfectly
    },
    setBoards: (state, action) => {
      state.boards = action.payload; // ✅ works perfectly
    },
    setTrashBoards: (state, action) => {
      state.trashBoards = action.payload; // ✅ works perfectly
    },
  },
});

// Export actions and reducer
export const { setProfile, setPendingUsers, setAdmin,setTrashBoards,setBoards} = profileSlice.actions;
export default profileSlice.reducer;
