import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  PlusCircle, 
  IndianRupee, 
  Sparkles, 
  Edit3, 
  Plus, 
  Eye,
  TrendingUp,
  Award
} from "lucide-react";
import Nav from "../../component/Nav";
import useGetCreatorCourseData from "../../customHooks/getCreatorCourseData";

function Dashboard() {
  const navigate = useNavigate();

  // Trigger creator courses fetch on mount
  useGetCreatorCourseData();

  // Extract course data with fallback to public courseData if creator array hasn't loaded
  const { creatorCourseData = [], courseData = [] } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);

  const coursesList = creatorCourseData.length > 0 ? creatorCourseData : courseData;

  // Stats Calculations
  const totalCourses = coursesList.length;
  const totalStudents = coursesList.reduce(
    (sum, course) => sum + (course.enrolledStudents?.length || 0),
    0
  );
  const publishedCourses = coursesList.filter(
    (course) => course.isPublished || course.status === "published"
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Nav />

      <div className="max-w-7xl mx-auto pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Creator Studio</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {userData?.name?.split(" ")[0] || "Instructor"}!
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your published content, monitor student engagement, and add new courses.
            </p>
          </div>

          <button
            onClick={() => navigate("/createcourses")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Course</span>
          </button>
        </div>

        {/* Analytics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Total Courses
              </p>
              <h3 className="text-3xl font-black text-white">{totalCourses}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Enrolled Students
              </p>
              <h3 className="text-3xl font-black text-white">{totalStudents}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Published Content
              </p>
              <h3 className="text-3xl font-black text-white">{publishedCourses}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Manage Courses Table */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-md overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Your Course Management</span>
            </h2>
            <span className="text-xs text-slate-400">
              {totalCourses} Courses total
            </span>
          </div>

          {coursesList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/60 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4 pl-6">Course</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Students</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {coursesList.map((course) => {
                    const title = course.courseTitle || course.title || "Untitled Course";
                    const thumbnail = course.courseThumbnail || course.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop";
                    const price = course.coursePrice ?? course.price ?? 0;
                    const isPublished = course.isPublished || course.status === "published";

                    return (
                      <tr
                        key={course._id}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="p-4 pl-6 font-semibold flex items-center gap-3">
                          <img
                            src={thumbnail}
                            alt={title}
                            className="w-12 h-8 rounded-lg object-cover bg-slate-800"
                            referrerPolicy="no-referrer"
                          />
                          <span className="line-clamp-1">{title}</span>
                        </td>
                        <td className="p-4 font-bold text-white">
                          ${price}
                        </td>
                        <td className="p-4 text-slate-400">
                          {course.enrolledStudents?.length || 0}
                        </td>
                        <td className="p-4">
                          {isPublished ? (
                            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full">
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="p-4 pr-6 text-right space-x-2">
                          <button
                            onClick={() => navigate(`/addcourses/${course._id}`)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 transition-all inline-flex items-center gap-1 text-xs font-medium cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => navigate(`/viewcourse/${course._id}`)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all inline-flex items-center gap-1 text-xs font-medium cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-700 mx-auto" />
              <p className="text-sm font-medium">You haven't created any courses yet.</p>
              <button
                onClick={() => navigate("/createcourses")}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer transition-colors"
              >
                Create First Course
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;