import { createSlice } from '@reduxjs/toolkit';

const boardsSlice = createSlice({
    name: 'boards',
    initialState: { boards: [] },
    reducers: {
        addBoard: (state, action) => {
            state.boards.push(action.payload);
        },
        updateBoard: (state, action) => {
            const updatedBoard = action.payload;
            const index = state.boards.findIndex(board => board.id === updatedBoard.id)

            if (index !== -1) {
                state.boards[index] = updatedBoard;
            }
        },
        deleteBoard: (state, action) => {
            const boardId = action.payload;
            state.boards = state.boards.filter(board => board.id !== boardId);
        }
    },
});

// Export actions and reducer
export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;