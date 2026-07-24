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
          `${serverUrl}/api/course/published`,
          {
            withCredentials: true,
          }
        );


        console.log("Published Courses API:", data);


        if (data.success) {

          dispatch(
            setCourseData(data.courses)
          );

        }


      } catch (error) {

        console.log(
          "Get Course Error:",
          error.response?.data || error
        );

      }

    };


    getAllPublishedCourses();


  }, [dispatch]);


};


export default useGetCourseData;