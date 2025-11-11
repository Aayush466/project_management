import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: {},
    pendingUsers: [],
    admin: false,
    trashCards: [],
    trashLists: [],
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
    setTrashCards: (state, action) => {
      state.trashCards = action.payload; // ✅ works perfectly
    },
    setTrashLists: (state, action) => {
      state.trashLists = action.payload; // ✅ works perfectly
    },
    setTrashBoards: (state, action) => {
      state.trashBoards = action.payload; // ✅ works perfectly
    },
  },
});

// Export actions and reducer
export const { setProfile, setPendingUsers, setAdmin,setTrashBoards,setTrashCards,setTrashLists } = profileSlice.actions;
export default profileSlice.reducer;
