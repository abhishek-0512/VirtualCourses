import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  creatorCourseData: [],
  courseData: [],
  selectedCourseData: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCreatorCourseData: (state, action) => {
      state.creatorCourseData = action.payload;
    },

    setCourseData: (state, action) => {
      state.courseData = action.payload;
    },

    setSelectedCourseData: (state, action) => {
      state.selectedCourseData = action.payload;
    },
  },
});

export const {
  setCreatorCourseData,
  setCourseData,
  setSelectedCourseData,
} = courseSlice.actions;

export default courseSlice.reducer;