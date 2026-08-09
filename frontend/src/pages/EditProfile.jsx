import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Camera, User, Sparkles } from "lucide-react";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../App";
import Nav from "../component/Nav";
import Footer from "../component/Footer";

function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    userData?.name || "User"
  )}`;

  const [name, setName] = useState(userData?.name || "");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(
    userData?.photoUrl && !userData.photoUrl.includes("avatar.iran.liara.run")
      ? userData.photoUrl
      : defaultAvatar
  );
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const { data } = await axios.put(
        `${serverUrl}/api/user/updateprofile`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      const updatedUser = data.user || data;

      if (data.success || updatedUser) {
        toast.success("Profile updated successfully!");
        dispatch(setUserData(updatedUser));
        navigate("/profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500">
      <Nav />

      <div className="max-w-xl mx-auto pt-24 pb-20 px-4 sm:px-6">
        <button
          onClick={() => navigate("/profile")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Profile</span>
        </button>

        <div className="p-8 sm:p-10 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="space-y-1 border-b border-slate-800 pb-4">
            <h1 className="text-2xl font-black text-white">Edit Profile</h1>
            <p className="text-xs text-slate-400">
              Update your display name and profile picture.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="relative group cursor-pointer">
                <img
                  src={preview}
                  alt="Profile Avatar"
                  className="w-28 h-28 rounded-3xl object-cover border-4 border-indigo-500/40 shadow-2xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultAvatar;
                  }}
                />
                <label className="absolute inset-0 bg-slate-950/70 rounded-3xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                  <span className="text-[10px] text-slate-200 mt-1 font-bold">Change</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Click photo to select image from your device
              </p>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Full Display Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Email (Readonly info) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Registered Email Address
              </label>
              <input
                type="email"
                value={userData?.email || ""}
                disabled
                className="w-full bg-slate-950/50 border border-slate-800/60 rounded-2xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Saving Changes..." : "Save Profile Settings"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default EditProfile;