import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Edit3, 
  BookOpen, 
  Award, 
  ArrowLeft,
  Bookmark,
  Sparkles,
  Trophy,
  CheckCircle,
  Clock,
  Trash2,
  PlayCircle
} from "lucide-react";
import Nav from "../component/Nav";
import Footer from "../component/Footer";
import Card from "../component/Card";

function Profile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userData } = useSelector((state) => state.user);
  const { courseData = [] } = useSelector((state) => state.course);

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("vc_bookmarks") || "[]");
      setBookmarks(saved);
    } catch (e) {
      setBookmarks([]);
    }
  }, []);

  const removeBookmark = (id) => {
    const updated = bookmarks.filter((b) => (b._id || b.id) !== id);
    setBookmarks(updated);
    localStorage.setItem("vc_bookmarks", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    userData?.name || "User"
  )}`;

  // Achievements Badges List
  const achievements = [
    { title: "Learning Pioneer", desc: "Joined Virtual Courses LMS", icon: Sparkles, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
    { title: "Knowledge Seeker", desc: "Enrolled in active courses", icon: BookOpen, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" },
    { title: "Voice AI Explorer", desc: "Used Gemini Voice Tutor", icon: Trophy, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
    { title: "Certified Achiever", desc: "Finished coursework with certificate", icon: Award, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  ];

  const completedLecturesCount = userData?.completedLectures?.length || 0;
  const enrolledCoursesCount = userData?.enrolledCourses?.length || 0;

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500">
      <Nav />

      <div className="max-w-5xl mx-auto pt-24 pb-20 px-4 sm:px-6">
        
        {/* Back Link */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </button>

        {/* Profile Card Header */}
        <div className="p-8 sm:p-10 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl space-y-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-8 border-b border-slate-800">
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <img
                src={userData.photoUrl || defaultAvatar}
                alt={userData.name}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-indigo-500/40 shadow-2xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
              />
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">
                    {userData.name}
                  </h1>
                  <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    {userData.role || "Student"}
                  </span>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm mt-1.5 flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{userData.email}</span>
                </p>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 mt-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Member</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/editprofile")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 transition-all cursor-pointer shadow-md"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">
                Courses Enrolled
              </span>
              <p className="text-2xl font-black text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>{enrolledCoursesCount}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">
                Lessons Finished
              </span>
              <p className="text-2xl font-black text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>{completedLecturesCount}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">
                Saved Bookmarks
              </span>
              <p className="text-2xl font-black text-white flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-400" />
                <span>{bookmarks.length}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">
                Account Status
              </span>
              <p className="text-2xl font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <span>Active</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Achievements & Badges
          </button>

          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "bookmarks"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Saved Bookmarks ({bookmarks.length})
          </button>
        </div>

        {/* Tab Content 1: Badges */}
        {activeTab === "overview" && (
          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Learner Achievements & Honors</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 flex items-center gap-4"
                  >
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${item.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content 2: Bookmarks */}
        {activeTab === "bookmarks" && (
          <div className="space-y-4">
            {bookmarks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.map((course) => (
                  <div
                    key={course._id || course.id}
                    className="group relative flex flex-col justify-between bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl"
                  >
                    <div className="relative aspect-video w-full bg-slate-800">
                      <img
                        src={course.thumbnail || "https://placehold.co/600x400"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        onClick={() => removeBookmark(course._id || course.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 border border-slate-700 text-rose-400 hover:scale-110 transition-all cursor-pointer"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-5 space-y-3">
                      <h4 className="text-sm font-bold text-white line-clamp-2">
                        {course.title}
                      </h4>
                      <button
                        onClick={() => navigate(`/viewcourse/${course._id || course.id}`)}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>View Course</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-3xl border border-slate-800 bg-slate-900/40 text-center space-y-3">
                <Bookmark className="w-10 h-10 text-slate-700 mx-auto" />
                <h4 className="text-base font-bold text-white">No Bookmarked Courses Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click the bookmark icon on any course card in the catalog to save it here for quick access!
                </p>
                <button
                  onClick={() => navigate("/allcourses")}
                  className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Explore Catalog
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}

export default Profile;