import React, { useEffect } from "react";
import { Edit3, ArrowLeft, Plus, BookOpen, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import img1 from "../assets/empty.jpg";
import Nav from "../component/Nav";
import Footer from "../component/Footer";

function Courses() {
  const navigate = useNavigate();
  const creatorCourseData = useSelector((state) => state.course.creatorCourseData);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500">
      <Nav />

      <div className="max-w-7xl mx-auto pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">Creator Studio</p>
              <h1 className="text-2xl font-black text-white">Manage Your Courses</h1>
            </div>
          </div>

          <button
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer self-start sm:self-auto"
            onClick={() => navigate("/createcourses")}
          >
            <Plus className="w-4 h-4" />
            <span>Create New Course</span>
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 shadow-2xl backdrop-blur-xl md:block">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-bold">Course Title</th>
                <th className="px-6 py-4 font-bold">Price</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {creatorCourseData?.map((course) => (
                <tr key={course?._id} className="transition hover:bg-slate-800/40">
                  <td className="flex items-center gap-3.5 px-6 py-4 font-semibold">
                    <img
                      src={course?.thumbnail || course?.courseThumbnail || img1}
                      alt=""
                      className="h-12 w-20 rounded-xl object-cover border border-slate-800"
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-bold text-white max-w-sm truncate">{course?.title || course?.courseTitle}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white">
                    {course?.price ? `₹${course.price}` : "FREE"}
                  </td>
                  <td className="px-6 py-4">
                    {course?.isPublished ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        <span>Published</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        <span>Draft</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="p-2 rounded-xl bg-slate-800 text-indigo-400 hover:text-indigo-300 hover:bg-slate-700 transition cursor-pointer"
                      onClick={() => navigate(`/addcourses/${course?._id}`)}
                      title="Edit Course"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="space-y-4 md:hidden">
          {creatorCourseData?.map((course) => (
            <div key={course?._id} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <img
                  src={course?.thumbnail || course?.courseThumbnail || img1}
                  alt=""
                  className="h-16 w-20 rounded-2xl object-cover border border-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="text-xs font-bold text-white truncate">{course?.title || course?.courseTitle}</h2>
                  <p className="mt-1 text-xs font-black text-emerald-400">
                    {course?.price ? `₹${course.price}` : "FREE"}
                  </p>
                </div>
                <button
                  className="p-2 rounded-xl bg-slate-800 text-indigo-400 hover:text-white transition"
                  onClick={() => navigate(`/addcourses/${course?._id}`)}
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {!creatorCourseData?.length && (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center text-slate-500 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-700 mx-auto" />
            <p className="text-xs font-semibold">No courses in studio yet. Create your first course to get started.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Courses;
