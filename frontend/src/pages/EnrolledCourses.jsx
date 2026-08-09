import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  PlayCircle, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Award, 
  Sparkles,
  Layers
} from "lucide-react";
import Nav from "../component/Nav";
import Footer from "../component/Footer";

function EnrolledCourses() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { courseData = [] } = useSelector((state) => state.course);

  const [activeTab, setActiveTab] = useState("all"); // all | in-progress | completed

  const completedLectureIds = userData?.completedLectures || [];

  // Filter courses user is enrolled in
  const enrolledList = courseData.filter((course) => {
    return userData?.enrolledCourses?.some((enrolled) => {
      const id = typeof enrolled === "string" ? enrolled : enrolled._id;
      return id?.toString() === course._id?.toString();
    });
  });

  // Calculate course progress helper
  const getCourseProgress = (course) => {
    const total = course.lectures?.length || 0;
    if (total === 0) return 0;
    const completed = course.lectures.filter((l) => {
      const lid = typeof l === "object" ? l._id?.toString() : l?.toString();
      return completedLectureIds.some((id) => id?.toString() === lid);
    }).length;
    return Math.round((completed / total) * 100);
  };

  // Filter by tab
  const displayedCourses = enrolledList.filter((course) => {
    const progress = getCourseProgress(course);
    if (activeTab === "in-progress") return progress < 100;
    if (activeTab === "completed") return progress === 100;
    return true;
  });

  const completedCount = enrolledList.filter(
    (c) => getCourseProgress(c) === 100
  ).length;
  const inProgressCount = enrolledList.length - completedCount;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500">
      <Nav />

      <div className="max-w-7xl mx-auto pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>My Learning Space</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Enrolled Courses & Progress
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            Pick up right where you left off, review lessons, and earn verified certificates.
          </p>
        </div>

        {/* Learning Statistics KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                Total Enrolled
              </span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white mt-2">
              {enrolledList.length}
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                In Progress
              </span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white mt-2">
              {inProgressCount}
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                Completed
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white mt-2">
              {completedCount}
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                Certificates
              </span>
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white mt-2">
              {completedCount}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mb-8 border-b border-slate-800 pb-3">
          {[
            { id: "all", label: `All Courses (${enrolledList.length})` },
            { id: "in-progress", label: `In Progress (${inProgressCount})` },
            { id: "completed", label: `Completed (${completedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        {displayedCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedCourses.map((course) => {
              const progress = getCourseProgress(course);
              const title = course.title || course.courseTitle || "Untitled Course";
              const thumbnail = course.thumbnail || course.courseThumbnail;
              const category = course.category || "General";
              const totalLecs = course.lectures?.length || 0;

              return (
                <div
                  key={course._id}
                  className="group relative flex flex-col justify-between bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-indigo-500/40 hover:-translate-y-1.5 transition-all duration-300 backdrop-blur-xl"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full bg-slate-800 overflow-hidden">
                      <img
                        src={thumbnail || "https://placehold.co/600x400"}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      
                      {category && (
                        <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-indigo-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                          {category}
                        </span>
                      )}

                      {progress === 100 && (
                        <span className="absolute top-3 right-3 bg-emerald-500/90 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Done</span>
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-5 space-y-3">
                      <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
                        {title}
                      </h3>

                      {/* Progress Bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between items-center text-[11px] font-semibold">
                          <span className="text-slate-400">{totalLecs} Lessons</span>
                          <span className="text-indigo-400 font-bold">{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-5 pt-0 mt-auto">
                    <button
                      onClick={() => navigate(`/viewlecture/${course._id}`)}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                        progress === 100
                          ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                          : "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-indigo-500/20"
                      }`}
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>{progress === 100 ? "Review Lectures" : progress > 0 ? "Continue Learning" : "Start Course"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 rounded-3xl border border-slate-800 bg-slate-900/40 text-center backdrop-blur-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {activeTab === "completed"
                ? "No Completed Courses Yet"
                : "No Enrolled Courses Found"}
            </h3>
            <p className="text-slate-400 text-xs max-w-md">
              {activeTab === "completed"
                ? "Finish all lectures in any enrolled course to claim your certificate!"
                : "Browse our 20,000+ courses to start your learning journey."}
            </p>
            <button
              onClick={() => navigate("/allcourses")}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-transform cursor-pointer"
            >
              Explore Course Catalog
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default EnrolledCourses;