    import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
  name: 'profile',
  initialState: { user: {} },
  reducers: {
    setProfile: (state, action) => {
      state.user = action.payload; // ✅ works perfectly
    },
  },
});

// Export actions and reducer
export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;