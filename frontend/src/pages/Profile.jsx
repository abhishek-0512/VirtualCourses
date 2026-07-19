import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

function Profile() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

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

        {/* Back Button */}

        <FaArrowLeftLong
          className="absolute top-8 left-6 w-6 h-6 cursor-pointer hover:scale-110 transition"
          onClick={() => navigate("/")}
        />

        {/* Profile Header */}

        <div className="flex flex-col items-center text-center">

          {userData?.photoUrl ? (
            <img
              src={userData.photoUrl}
              alt={userData.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-black"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-3xl border-2 border-white">
              {userData?.name?.charAt(0).toUpperCase()}
            </div>
          )}

          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            {userData?.name}
          </h2>

          <p className="text-sm text-gray-500 capitalize">
            {userData?.role}
          </p>

        </div>

        {/* Profile Info */}

        <div className="mt-6 space-y-4">

          <div>
            <span className="font-semibold">Email : </span>
            <span>{userData?.email}</span>
          </div>

          <div>
            <span className="font-semibold">Bio : </span>
            <span>
              {userData?.description || "No bio added yet."}
            </span>
          </div>

          <div>
            <span className="font-semibold">
              Enrolled Courses :
            </span>{" "}
            <span>
              {userData?.enrolledCourses?.length || 0}
            </span>
          </div>

        </div>

        {/* Action */}

        <div className="mt-8 flex justify-center">

          <button
            onClick={() => navigate("/editprofile")}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition cursor-pointer"
          >
            Edit Profile
          </button>

        </div>

      </div>

    </div>
  );
}

export default Profile;