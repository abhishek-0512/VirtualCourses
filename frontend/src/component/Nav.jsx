import React, { useEffect, useState } from "react";
import logo from "../assets/logo.jpg";
import { IoMdPerson } from "react-icons/io";
import { GiHamburgerMenu, GiSplitCross } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Nav() {
  const [showHam, setShowHam] = useState(false);
  const [showPro, setShowPro] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true });
      dispatch(setUserData(null));
      toast.success("Logout Successfully");
      setShowHam(false);
      setShowPro(false);
      navigate("/");
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    const closeProfile = () => setShowPro(false);
    window.addEventListener("click", closeProfile);
    return () => window.removeEventListener("click", closeProfile);
  }, []);

  const Avatar = () => (
    <div
      className="flex h-11 w-11 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/20 bg-slate-900 text-lg font-semibold text-white shadow-lg"
      onClick={(e) => {
        e.stopPropagation();
        setShowPro((prev) => !prev);
      }}
    >
      {userData?.photoUrl ? (
        <img src={userData.photoUrl} className="h-full w-full object-cover" alt="profile" />
      ) : (
        <span>{userData?.name?.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );

  return (
    <div>
      <div className="fixed inset-x-0 top-0 z-50 h-20 border-b border-white/10 bg-slate-950/40 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl h-full items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Virtual Courses"
              className="h-11 w-11 cursor-pointer rounded-xl border border-white/20 object-cover"
              onClick={() => {
                navigate("/");
                setShowHam(false);
                setShowPro(false);
              }}
            />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold tracking-[0.2em] text-white uppercase">Virtual Courses</p>
              <p className="text-xs text-slate-300">Learning, reimagined</p>
            </div>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {!userData ? (
              <button
                className="rounded-full border border-white/20 bg-white/10 p-2 text-white transition hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPro((prev) => !prev);
                }}
              >
                <IoMdPerson className="h-5 w-5" />
              </button>
            ) : (
              <Avatar />
            )}

            {userData?.role === "educator" && (
              <button
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                onClick={() => {
                  navigate("/dashboard");
                  setShowPro(false);
                }}
              >
                Dashboard
              </button>
            )}

            {!userData ? (
              <button
                className="rounded-full border border-white/20 bg-transparent px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            ) : (
              <button
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>

          <button className="rounded-full border border-white/20 bg-white/10 p-2 text-white lg:hidden" onClick={() => setShowHam((prev) => !prev)}>
            {showHam ? <GiSplitCross className="h-5 w-5" /> : <GiHamburgerMenu className="h-5 w-5" />}
          </button>
        </div>

        {showPro && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-6 top-20 flex min-w-[180px] flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl"
          >
            <button
              className="rounded-xl bg-slate-900 px-4 py-2 text-left text-sm font-medium text-white transition hover:bg-slate-700"
              onClick={() => {
                navigate("/profile");
                setShowPro(false);
              }}
            >
              My Profile
            </button>
            <button
              className="rounded-xl bg-slate-100 px-4 py-2 text-left text-sm font-medium text-slate-800 transition hover:bg-slate-200"
              onClick={() => {
                navigate("/enrolledcourses");
                setShowPro(false);
              }}
            >
              My Courses
            </button>
          </div>
        )}
      </div>

      <div className="h-20" aria-hidden="true" />

      <div className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-slate-950/95 px-6 transition-transform duration-500 ease-in-out lg:hidden ${showHam ? "translate-x-0" : "-translate-x-full"}`}>
        <button className="absolute right-6 top-6 rounded-full border border-white/20 p-2 text-white" onClick={() => setShowHam(false)}>
          <GiSplitCross className="h-5 w-5" />
        </button>

        {!userData ? (
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white">
            <IoMdPerson className="h-6 w-6" />
          </div>
        ) : (
          <Avatar />
        )}

        <button className="w-full max-w-[260px] rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-base font-semibold text-white" onClick={() => { navigate("/profile"); setShowHam(false); setShowPro(false); }}>
          My Profile
        </button>
        <button className="w-full max-w-[260px] rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-base font-semibold text-white" onClick={() => { navigate("/enrolledcourses"); setShowHam(false); setShowPro(false); }}>
          My Courses
        </button>
        {userData?.role === "educator" && (
          <button className="w-full max-w-[260px] rounded-2xl bg-white px-5 py-3 text-base font-semibold text-slate-900" onClick={() => { navigate("/dashboard"); setShowHam(false); setShowPro(false); }}>
            Dashboard
          </button>
        )}
        {!userData ? (
          <button className="w-full max-w-[260px] rounded-2xl border border-white/15 bg-transparent px-5 py-3 text-base font-semibold text-white" onClick={() => { navigate("/login"); setShowHam(false); }}>
            Login
          </button>
        ) : (
          <button className="w-full max-w-[260px] rounded-2xl bg-white px-5 py-3 text-base font-semibold text-slate-900" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Nav;