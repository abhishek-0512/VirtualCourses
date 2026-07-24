import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setCreatorCourseData } from "../redux/courseSlice";


const useGetCreatorCourseData = () => {


  const dispatch = useDispatch();



  useEffect(() => {


    const getCreatorCourses = async () => {


      try {


        const { data } = await axios.get(

          `${serverUrl}/api/course/creator/courses`,

          {
            withCredentials:true
          }

        );


        console.log(
          "Creator Course API:",
          data
        );



        if(data.success){


          dispatch(

            setCreatorCourseData(
              data.courses
            )

          );


        }



      }
      catch(error){


        console.log(

          "Creator Course Error:",
          error.response?.data || error

        );


      }


    };



    getCreatorCourses();



  },[dispatch]);



};


export default useGetCreatorCourseData;