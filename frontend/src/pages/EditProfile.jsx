import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { setUserData } from "../redux/userSlice";
import { ClipLoader } from "react-spinners";
import { FaArrowLeftLong } from "react-icons/fa6";

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setDescription(userData.description || "");
    }
  }, [userData]);

  const updateProfile = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);

      if (photoUrl) {
        formData.append("photoUrl", photoUrl);
      }

      const result = await axios.post(
        serverUrl + "/api/user/updateprofile",
        formData,
        {
          withCredentials: true,
        }
      );

      dispatch(setUserData(result.data));
      toast.success("Profile updated successfully");
      navigate("/profile");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <FaArrowLeftLong
          className="absolute top-6 left-6 w-6 h-6 cursor-pointer hover:scale-110 transition"
          onClick={() => navigate("/profile")}
        />

        <h1 className="text-2xl font-bold text-center mb-6">Edit Profile</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Bio</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoUrl(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-6 py-3 border border-black rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={updateProfile}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
            >
              {loading ? <ClipLoader size={18} color="white" /> : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
