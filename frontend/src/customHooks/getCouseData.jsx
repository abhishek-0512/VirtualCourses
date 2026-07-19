import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setCourseData } from "../redux/courseSlice";

const useGetCourseData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("HOOK STARTED");

    const getAllPublishedCourses = async () => {
      try {
        const { data } = await axios.get(
          serverUrl + "/api/course/getpublishedcourses",
          {
            withCredentials: true,
          }
        );

        console.log("API DATA:", data);

        dispatch(setCourseData(data));

        console.log("DISPATCH DONE");
      } catch (error) {
        console.log("ERROR:", error);
      }
    };

    getAllPublishedCourses();
  }, [dispatch]);
};

export default useGetCourseData;