import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BookOpen, PlayCircle, GraduationCap, ArrowRight } from "lucide-react";
import Nav from "../component/Nav";
import Card from "../component/Card";

function EnrolledCourses() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { courseData = [] } = useSelector((state) => state.course);

  // Filter courses user is enrolled in
  const enrolledList = courseData.filter((course) => {
    return userData?.enrolledCourses?.some((enrolled) => {
      const id = typeof enrolled === "string" ? enrolled : enrolled._id;
      return id?.toString() === course._id?.toString();
    });
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Nav />

      <div className="max-w-7xl mx-auto pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300 mb-3">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>My Learning Journey</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Enrolled Courses
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Pick up right where you left off and keep building your skills.
          </p>
        </div>

        {/* Course Grid */}
        {enrolledList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {enrolledList.map((course) => (
              <div
                key={course._id}
                className="group relative flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full bg-slate-800 overflow-hidden">
                  <img
                    src={course.thumbnail || "https://placehold.co/600x400"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  {course.category && (
                    <span className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md border border-slate-700/60 text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {course.category}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
                    {course.title}
                  </h3>

                  <div className="mt-auto pt-6">
                    <button
                      onClick={() => navigate(`/viewlecture/${course._id}`)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all"
                    >
                      <PlayCircle className="w-4 h-4 fill-white text-indigo-600" />
                      <span>Continue Learning</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 rounded-3xl border border-slate-800 bg-slate-900/40 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No Enrolled Courses Found
            </h3>
            <p className="text-slate-400 text-sm max-w-md mb-6">
              You haven't enrolled in any courses yet. Browse our catalog to find your next course!
            </p>
            <button
              onClick={() => navigate("/allcourses")}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-xs rounded-xl shadow-lg transition-all"
            >
              Explore Course Catalog
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnrolledCourses;