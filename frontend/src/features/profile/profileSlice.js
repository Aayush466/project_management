import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: {},
    pendingUsers: [],
    rejectedUsers: [],
    acceptedUsers: [],
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
    setRejectedUsers: (state, action) => {
      state.rejectedUsers = action.payload; // ✅ works perfectly
    },
    setAcceptedUsers: (state, action) => {
      state.acceptedUsers = action.payload; // ✅ works perfectly
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
export const { setProfile, setPendingUsers,setRejectedUsers,setAcceptedUsers, setAdmin,setTrashBoards,setBoards} = profileSlice.actions;
export default profileSlice.reducer;
