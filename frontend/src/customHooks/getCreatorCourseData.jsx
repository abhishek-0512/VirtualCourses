import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { serverUrl } from "../App";
import { setCreatorCourseData } from "../redux/courseSlice";

const useGetCreatorCourseData = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const getCreatorData = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/course/getcreatorcourses`,
          {
            withCredentials: true,
          }
        );

        dispatch(setCreatorCourseData(data));
      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data?.message || "Failed to load creator courses."
        );
      }
    };

    if (userData?.role === "educator") {
      getCreatorData();
    }
  }, [dispatch, userData]);
};

export default useGetCreatorCourseData;