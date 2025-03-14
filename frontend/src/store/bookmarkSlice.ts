import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookmarkState {
  bookmarks: string[]; 
}

const initialState: BookmarkState = {
  bookmarks: [],
};

const bookmarkSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    toggleBookmark: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      if (state.bookmarks.includes(taskId)) {
        state.bookmarks = state.bookmarks.filter((id) => id !== taskId);
      } else {
        state.bookmarks.push(taskId);
      }
    },
    removeBookmark: (state, action: PayloadAction<string>) => {
      state.bookmarks = state.bookmarks.filter((id) => id !== action.payload);
    },
  },
});

export const { toggleBookmark, removeBookmark } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
