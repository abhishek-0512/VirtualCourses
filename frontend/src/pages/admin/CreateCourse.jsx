import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, BookPlus, Sparkles, FolderPlus } from "lucide-react";
import { serverUrl } from "../../App";
import Nav from "../../component/Nav";

function CreateCourse() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [loading, setLoading] = useState(false);

  const categories = [
    "Web Development",
    "Data Science",
    "Mobile Development",
    "AI & Machine Learning",
    "UI/UX Design",
    "Business",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a course title");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/course/create`,
        { title, category },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message || "Course created!");
        navigate(`/addcourses/${data.course._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Nav />

      <div className="max-w-3xl mx-auto pt-24 pb-20 px-4 sm:px-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Dashboard</span>
        </button>

        <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">
                Create New Course
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                Set a title and category to initialize your new learning path.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Course Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master Full-Stack Web Development"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Creating..." : "Continue to Course Editor"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateCourse;