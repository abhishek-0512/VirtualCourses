import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import { serverUrl } from "../App";
import { setCourseData } from "../redux/courseSlice";

const useGetCourseData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllPublishedCourses = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/course/getpublishedcoures`,
          {
            withCredentials: true,
          }
        );

        dispatch(setCourseData(data));
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    getAllPublishedCourses();
  }, [dispatch]);
};

export default useGetCourseData;