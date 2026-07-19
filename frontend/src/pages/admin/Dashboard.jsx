import React from "react";
import { useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import img from "../../assets/empty.jpg";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

function Dashboard() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { creatorCourseData } = useSelector((state) => state.course);

  const courseProgressData = creatorCourseData?.map((course) => ({
    name: course.title.slice(0, 10) + (course.title.length > 10 ? "..." : ""),
    lectures: course.lectures?.length || 0,
  })) || [];

  const enrollData = creatorCourseData?.map((course) => ({
    name: course.title.slice(0, 10) + (course.title.length > 10 ? "..." : ""),
    enrolled: course.enrolledStudents?.length || 0,
  })) || [];

  const totalEarnings = creatorCourseData?.reduce((sum, course) => {
    const studentCount = course.enrolledStudents?.length || 0;
    const courseRevenue = course.price ? course.price * studentCount : 0;
    return sum + courseRevenue;
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <button className="mb-6 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50" onClick={() => navigate("/")}>
          <FaArrowLeftLong className="h-4 w-4" />
          Back home
        </button>

        <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.2)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <img src={userData?.photoUrl || img} alt="Educator" className="h-20 w-20 rounded-full border-4 border-slate-900 object-cover shadow-lg" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Instructor dashboard</p>
                <h1 className="mt-1 text-2xl font-semibold text-slate-900">Welcome back, {userData?.name || "Educator"} 👋</h1>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">{userData?.description || "Create new learning experiences and keep your students engaged."}</p>
              </div>
            </div>
            <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800" onClick={() => navigate("/courses")}>Create a course</button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { label: "Total revenue", value: `₹${totalEarnings.toLocaleString()}` },
              { label: "Courses", value: creatorCourseData?.length || 0 },
              { label: "Students", value: creatorCourseData?.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0) || 0 },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">Course lectures</h2>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dbe2ea" />
                    <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="lectures" fill="#111827" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">Student enrollment</h2>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={enrollData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dbe2ea" />
                    <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="enrolled" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
