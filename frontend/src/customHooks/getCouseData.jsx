import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setCourseData } from "../redux/courseSlice";

const useGetCourseData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const getCourses = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/course/published`, {
          withCredentials: true,
        });

        if (data.success && isMounted) {
          const coursesList =
            data.courses || data.publishedCourses || data.allCourses || [];
          dispatch(setCourseData(coursesList));
        }
      } catch (error) {
        console.error("Get Course Error:", error.response?.data || error);
        if (isMounted) {
          dispatch(setCourseData([]));
        }
      }
    };

    getCourses();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);
};

export default useGetCourseData;