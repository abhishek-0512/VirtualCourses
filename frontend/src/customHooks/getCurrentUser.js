import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/auth/current`, // Updated to match backend authRoute.js
          {
            withCredentials: true,
          }
        );

        if (data.success) {
          dispatch(setUserData(data.user || data));
        }
      } catch (error) {
        // 401 is normal when no user is logged in — handle quietly without error logs
        if (error.response?.status === 401) {
          dispatch(setUserData(null));
        } else {
          console.error("Failed to fetch current user:", error);
          dispatch(setUserData(null));
        }
      }
    };

    fetchCurrentUser();
  }, [dispatch]);
};

export default useGetCurrentUser;