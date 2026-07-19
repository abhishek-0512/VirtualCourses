import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import { serverUrl } from "../App";
import { setAllReview } from "../redux/reviewSlice";

const useGetAllReviews = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/review/allReview`,
          {
            withCredentials: true,
          }
        );

        dispatch(setAllReview(data));
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    fetchAllReviews();
  }, [dispatch]);
};

export default useGetAllReviews;