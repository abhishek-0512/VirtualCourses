import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setCourseData } from "../redux/courseSlice";

const useGetCourseData = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const getCourses = async () => {
      try {
        let endpoint = `${serverUrl}/api/course/published`;

        // Educators should see all of their own courses
        if (userData?.role === "educator") {
          endpoint = `${serverUrl}/api/course/creator/courses`;
        }

        const { data } = await axios.get(endpoint, {
          withCredentials: true,
        });

        if (data.success) {
          dispatch(
            setCourseData(data.courses || [])
          );
        }
      } catch (error) {
        console.error(
          "Get Course Error:",
          error.response?.data || error
        );

        dispatch(setCourseData([]));
      }
    };

    getCourses();
  }, [dispatch, userData]);
};

export default useGetCourseData;