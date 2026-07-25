import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Edit3, 
  BookOpen, 
  Award, 
  ArrowLeft 
} from "lucide-react";
import Nav from "../component/Nav";

function Profile() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <p>Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Nav />

      <div className="max-w-4xl mx-auto pt-24 pb-20 px-4 sm:px-6">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </button>

        <div className="p-8 sm:p-10 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl space-y-8">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-slate-800">
            <img
              src={userData.photoUrl || "https://avatar.iran.liara.run/public"}
              alt={userData.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500/40 shadow-xl"
            />
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {userData.name}
                </h1>
                <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {userData.role || "Student"}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>{userData.email}</span>
              </p>
            </div>

            <button
              onClick={() => navigate("/editprofile")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Account Details Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block mb-1">
                Enrolled Courses
              </span>
              <p className="text-2xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>{userData.enrolledCourses?.length || 0} Courses</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block mb-1">
                Account Status
              </span>
              <p className="text-2xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Verified Account</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;