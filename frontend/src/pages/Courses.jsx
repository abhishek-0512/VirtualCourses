import React, { useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import img1 from "../assets/empty.jpg";
import { FaArrowLeftLong } from "react-icons/fa6";

function Courses() {
  const navigate = useNavigate();
  const creatorCourseData = useSelector((state) => state.course.creatorCourseData);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <FaArrowLeftLong className="h-5 w-5 cursor-pointer text-slate-700" onClick={() => navigate("/dashboard")} />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Course studio</p>
              <h1 className="text-2xl font-semibold text-slate-900">Manage your courses</h1>
            </div>
          </div>

          <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800" onClick={() => navigate("/createcourses")}>
            Create course
          </button>
        </div>

        <div className="hidden overflow-hidden rounded-[28px] border border-slate-200 bg-white/90 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.16)] md:block">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Course</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Price</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {creatorCourseData?.map((course) => (
                <tr key={course?._id} className="border-t border-slate-100 transition hover:bg-slate-50">
                  <td className="flex items-center gap-4 px-4 py-4">
                    {course?.thumbnail ? (
                      <img src={course?.thumbnail} alt="" className="h-14 w-24 rounded-xl object-cover" />
                    ) : (
                      <img src={img1} alt="" className="h-14 w-24 rounded-xl object-cover" />
                    )}
                    <span className="font-medium text-slate-800">{course?.title}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-700">₹{course?.price || "NA"}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${course?.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {course?.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900" onClick={() => navigate(`/addcourses/${course?._id}`)}>
                      <FaEdit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 md:hidden">
          {creatorCourseData?.map((course) => (
            <div key={course?._id} className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                {course?.thumbnail ? (
                  <img src={course?.thumbnail} alt="" className="h-16 w-16 rounded-xl object-cover" />
                ) : (
                  <img src={img1} alt="" className="h-16 w-16 rounded-xl object-cover" />
                )}
                <div className="flex-1">
                  <h2 className="text-sm font-semibold text-slate-900">{course?.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">₹{course?.price || "NA"}</p>
                </div>
                <button className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900" onClick={() => navigate(`/addcourses/${course?._id}`)}>
                  <FaEdit className="h-4 w-4" />
                </button>
              </div>
              <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${course?.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {course?.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          ))}
        </div>

        {!creatorCourseData?.length && (
          <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
            No courses yet. Create your first course to get started.
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;
