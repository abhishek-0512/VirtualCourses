import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setAllReview } from "../redux/reviewSlice";


const useGetAllReviews = () => {


  const dispatch = useDispatch();



  useEffect(() => {


    const getReviews = async () => {


      try {


        const { data } = await axios.get(

          `${serverUrl}/api/review/allreviews`,

          {
            withCredentials:true
          }

        );


        console.log(
          "Reviews API:",
          data
        );



        if(data.success){


          dispatch(
            setAllReview(data.reviews)
          );


        }



      }
      catch(error){


        console.log(

          "Review Fetch Error:",
          error.response?.data || error

        );


      }


    };



    getReviews();



  },[dispatch]);



};


export default useGetAllReviews;