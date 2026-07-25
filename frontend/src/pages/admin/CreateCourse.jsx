import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  BookOpen,
  ArrowLeft,
  Upload,
  Sparkles,
  DollarSign,
  Tag,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { serverUrl } from "../../App";
import Nav from "../../component/Nav";

function CreateCourse() {
  const navigate = useNavigate();

  const [courseTitle, setCourseTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [courseLevel, setCourseLevel] = useState("Beginner");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseThumbnail, setCourseThumbnail] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [loading, setLoading] = useState(false);

  // Categories list
  const categories = [
    "Web Development",
    "Data Science & AI",
    "Mobile Development",
    "UI/UX Design",
    "Cloud Computing",
    "Cybersecurity",
  ];

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseThumbnail(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Submit Handler: POST /api/course/create
  const handleCreateCourse = async (e) => {
    e.preventDefault();

    if (!courseTitle || !category || !coursePrice) {
      return toast.error("Please fill in all required fields");
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("courseTitle", courseTitle);
      formData.append("subTitle", subTitle);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("courseLevel", courseLevel);
      formData.append("coursePrice", coursePrice);

      if (courseThumbnail) {
        formData.append("courseThumbnail", courseThumbnail);
      }

      const { data } = await axios.post(
        `${serverUrl}/api/course/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message || "Course created successfully!");
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

      <div className="max-w-4xl mx-auto pt-24 pb-20 px-4 sm:px-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Dashboard</span>
        </button>

        <div className="p-8 sm:p-10 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl space-y-8">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Create New Course</h1>
              <p className="text-xs text-slate-400">
                Set up basic course information before adding curriculum lectures.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateCourse} className="space-y-6">
            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Course Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Full-Stack Web Development Bootcamp"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Subtitle / Short Summary
                </label>
                <input
                  type="text"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  placeholder="e.g. Master React, Node.js, and MongoDB by building real apps."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Detailed Description
              </label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What students will learn in this course..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all resize-none"
              />
            </div>

            {/* Category, Level & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-400" /> Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                  required
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" /> Level
                </label>
                <select
                  value={courseLevel}
                  onChange={(e) => setCourseLevel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Medium">Medium</option>
                  <option value="Advance">Advance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-indigo-400" /> Price ($) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(e.target.value)}
                  placeholder="89.99"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" /> Course Thumbnail
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Course Preview"
                    className="w-32 h-20 object-cover rounded-xl border border-slate-800"
                  />
                ) : (
                  <div className="w-32 h-20 rounded-xl bg-slate-900 border border-dashed border-slate-800 flex items-center justify-center text-slate-600">
                    <ImageIcon className="w-8 h-8 stroke-1" />
                  </div>
                )}

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500">
                    Recommended aspect ratio: 16:9 (e.g. 1280x720px)
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-8"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? "Creating Course Shell..." : "Create Course & Continue to Curriculum"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateCourse;