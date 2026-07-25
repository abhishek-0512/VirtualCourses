import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";

const useGetAllReviews = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/review/all`, {
          withCredentials: true,
        });

        if (data.success && isMounted) {
          // Dispatch review state to Redux if implemented
        }
      } catch (error) {
        if (error.response?.status !== 404 && isMounted) {
          console.error("Review fetch error:", error.message);
        }
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);
};

export default useGetAllReviews;