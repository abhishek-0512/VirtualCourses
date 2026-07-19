import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lectureData: [],
};

const lectureSlice = createSlice({
  name: "lecture",
  initialState,
  reducers: {
    setLectureData: (state, action) => {
      state.lectureData = action.payload;
    },
  },
});

export const { setLectureData } = lectureSlice.actions;

export default lectureSlice.reducer;