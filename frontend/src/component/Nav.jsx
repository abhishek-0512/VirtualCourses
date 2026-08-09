import React, { useEffect, useState } from "react";
import logo from "../assets/logo.jpg";
import { 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  Search, 
  User, 
  Bookmark, 
  LogOut, 
  LayoutDashboard, 
  Compass, 
  Menu, 
  X,
  ChevronDown,
  Shield
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Nav() {
  const [showHam, setShowHam] = useState(false);
  const [showPro, setShowPro] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  // Sync bookmarks count from localStorage
  useEffect(() => {
    const updateBookmarks = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("vc_bookmarks") || "[]");
        setBookmarksCount(saved.length);
      } catch (e) {
        setBookmarksCount(0);
      }
    };
    updateBookmarks();
    window.addEventListener("storage", updateBookmarks);
    return () => window.removeEventListener("storage", updateBookmarks);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true });
      localStorage.removeItem("token");
      dispatch(setUserData(null));
      toast.success("Logged out successfully");
      setShowHam(false);
      setShowPro(false);
      navigate("/");
    } catch (error) {
      console.log(error?.response?.data?.message);
      // Fallback clean logout
      localStorage.removeItem("token");
      dispatch(setUserData(null));
      navigate("/");
    }
  };

  useEffect(() => {
    const closeProfile = () => setShowPro(false);
    window.addEventListener("click", closeProfile);
    return () => window.removeEventListener("click", closeProfile);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      {/* Top Fixed Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 h-20 border-b border-slate-800/80 bg-slate-950/75 px-4 backdrop-blur-2xl sm:px-6 lg:px-8">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => {
              navigate("/");
              setShowHam(false);
              setShowPro(false);
            }}
          >
            <div className="relative">
              {!imgError ? (
                <img
                  src={logo}
                  alt="Virtual Courses"
                  className="h-11 w-11 rounded-2xl border border-indigo-500/30 object-cover shadow-lg shadow-indigo-500/10 group-hover:scale-105 group-hover:border-indigo-500/60 transition-all duration-300"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-500/40 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-all">
                  <GraduationCap className="h-6 w-6" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-950" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  VirtualCourses
                </span>
                <span className="rounded-md bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Future-Ready Learning
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 rounded-full px-3 py-1.5 shadow-inner">
            <button
              onClick={() => navigate("/allcourses")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isActive("/allcourses")
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Courses</span>
            </button>

            <button
              onClick={() => navigate("/searchwithai")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isActive("/searchwithai")
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Search</span>
            </button>

            {userData && (
              <button
                onClick={() => navigate("/enrolledcourses")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive("/enrolledcourses")
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>My Learning</span>
              </button>
            )}

            {userData?.role === "educator" && (
              <button
                onClick={() => navigate("/dashboard")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive("/dashboard") || isActive("/createcourses")
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold"
                    : "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Creator Studio</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {/* AI Search Quick Jump */}
            <button
              onClick={() => navigate("/searchwithai")}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/40 text-xs transition-all cursor-pointer"
              title="Search with Gemini AI"
            >
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden xl:inline">Ask AI</span>
              <kbd className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Bookmarks Icon */}
            {userData && (
              <button
                onClick={() => navigate("/profile?tab=bookmarks")}
                className="relative p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
                title="Saved Bookmarks"
              >
                <Bookmark className="w-4 h-4" />
                {bookmarksCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white shadow-md">
                    {bookmarksCount}
                  </span>
                )}
              </button>
            )}

            {!userData ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 rounded-2xl border border-slate-700/80 bg-slate-900/60 text-xs font-semibold text-slate-200 hover:text-white hover:border-indigo-500/40 transition-all cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Get Started Free
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPro((prev) => !prev);
                  }}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-slate-800 bg-slate-900/80 hover:border-indigo-500/40 transition-all cursor-pointer"
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden border border-indigo-500/40 bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                    {userData.photoUrl ? (
                      <img
                        src={userData.photoUrl}
                        alt={userData.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span>{userData?.name?.charAt(0).toUpperCase() || "U"}</span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                    {userData.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {showPro && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-14 w-60 rounded-3xl border border-slate-800 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-2xl z-50 animate-fadeIn space-y-1"
                  >
                    <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                      <p className="text-xs font-bold text-white truncate">
                        {userData.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {userData.email}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase">
                        <Shield className="w-3 h-3" />
                        {userData.role || "Student"}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowPro(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all text-left cursor-pointer"
                    >
                      <User className="w-4 h-4 text-indigo-400" />
                      <span>My Profile & Badges</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate("/enrolledcourses");
                        setShowPro(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all text-left cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <span>Enrolled Courses</span>
                    </button>

                    {userData?.role === "educator" && (
                      <button
                        onClick={() => {
                          navigate("/dashboard");
                          setShowPro(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-all text-left cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Creator Studio</span>
                      </button>
                    )}

                    <div className="border-t border-slate-800/80 pt-1 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-2.5 text-slate-300 hover:text-white lg:hidden cursor-pointer"
            onClick={() => setShowHam((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {showHam ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Spacer to prevent page underlap */}
      <div className="h-20" aria-hidden="true" />

      {/* Mobile Slide-in Drawer */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-slate-950/98 p-6 backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          showHam ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6 pt-16">
          {userData && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-indigo-500/40 bg-indigo-600 flex items-center justify-center text-white font-bold">
                {userData.photoUrl ? (
                  <img
                    src={userData.photoUrl}
                    alt={userData.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{userData?.name?.charAt(0).toUpperCase() || "U"}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{userData.name}</p>
                <p className="text-xs text-slate-400 truncate">{userData.email}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={() => {
                navigate("/allcourses");
                setShowHam(false);
              }}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-sm font-semibold text-slate-200"
            >
              <Compass className="w-5 h-5 text-indigo-400" />
              <span>Explore All Courses</span>
            </button>

            <button
              onClick={() => {
                navigate("/searchwithai");
                setShowHam(false);
              }}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-sm font-semibold text-slate-200"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Ask Gemini AI</span>
            </button>

            {userData && (
              <>
                <button
                  onClick={() => {
                    navigate("/enrolledcourses");
                    setShowHam(false);
                  }}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-sm font-semibold text-slate-200"
                >
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <span>Enrolled Courses</span>
                </button>

                <button
                  onClick={() => {
                    navigate("/profile");
                    setShowHam(false);
                  }}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-sm font-semibold text-slate-200"
                >
                  <User className="w-5 h-5 text-indigo-400" />
                  <span>My Profile & Badges</span>
                </button>

                {userData?.role === "educator" && (
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setShowHam(false);
                    }}
                    className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-sm font-semibold text-amber-400"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Creator Studio</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Auth Actions */}
        <div className="pt-6 border-t border-slate-800">
          {!userData ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  navigate("/login");
                  setShowHam(false);
                }}
                className="py-3 rounded-2xl border border-slate-700 bg-slate-900 text-sm font-bold text-white text-center"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  navigate("/signup");
                  setShowHam(false);
                }}
                className="py-3 rounded-2xl bg-indigo-600 text-sm font-bold text-white text-center"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full py-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-sm font-bold text-rose-400 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;