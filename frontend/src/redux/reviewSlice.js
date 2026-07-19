import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allReview: [],
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setAllReview: (state, action) => {
      state.allReview = action.payload;
    },
  },
});

export const { setAllReview } = reviewSlice.actions;

export default reviewSlice.reducer;