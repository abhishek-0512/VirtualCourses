import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setCreatorCourseData } from "../redux/courseSlice";

const useGetCreatorCourseData = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    let isMounted = true;

    const getCreatorCourses = async () => {
      if (!userData || userData.role !== "educator") return;

      try {
        const { data } = await axios.get(
          `${serverUrl}/api/course/creator/courses`,
          { withCredentials: true }
        );

        if (data.success && isMounted) {
          const creatorCourses =
            data.courses || data.creatorCourses || data.allCourses || [];
          dispatch(setCreatorCourseData(creatorCourses));
        }
      } catch (error) {
        if (error.response?.status !== 401 && isMounted) {
          console.error(
            "Creator Course Fetch Error:",
            error.response?.data?.message || error.message
          );
        }
      }
    };

    getCreatorCourses();

    return () => {
      isMounted = false;
    };
  }, [userData?.role, userData?._id, dispatch]);
};

export default useGetCreatorCourseData;