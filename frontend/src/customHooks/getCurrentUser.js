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
          `${serverUrl}/api/user/currentuser`,
          {
            withCredentials: true,
          }
        );

        dispatch(setUserData(data));
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        dispatch(setUserData(null));
      }
    };

    fetchCurrentUser();
  }, [dispatch]);
};

export default useGetCurrentUser;