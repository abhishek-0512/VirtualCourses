import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lectureData: [],
  selectedLectureData: null,
};

const lectureSlice = createSlice({
  name: "lecture",

  initialState,

  reducers: {

    setLectureData: (state, action) => {
      state.lectureData = action.payload;
    },

    setSelectedLectureData: (state, action) => {
      state.selectedLectureData = action.payload;
    },

    addLecture: (state, action) => {
      state.lectureData.push(action.payload);
    },

    removeLecture: (state, action) => {
      state.lectureData = state.lectureData.filter(
        (lecture) => lecture._id !== action.payload
      );
    },

    updateLectureData: (state, action) => {

      const index = state.lectureData.findIndex(
        (lecture) => lecture._id === action.payload._id
      );

      if(index !== -1){
        state.lectureData[index] = action.payload;
      }

    }

  },
});


export const {
  setLectureData,
  setSelectedLectureData,
  addLecture,
  removeLecture,
  updateLectureData

} = lectureSlice.actions;


export default lectureSlice.reducer;