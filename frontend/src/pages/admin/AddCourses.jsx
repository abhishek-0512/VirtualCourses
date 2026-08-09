import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  ArrowLeft, 
  Plus, 
  Upload, 
  Trash2, 
  Edit3, 
  Video, 
  DollarSign, 
  BookOpen, 
  Globe, 
  Image as ImageIcon,
  PlayCircle,
  CheckCircle,
  Eye
} from "lucide-react";
import { serverUrl } from "../../App";
import Nav from "../../component/Nav";
import Footer from "../../component/Footer";

function AddCourses() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [price, setPrice] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch course details on load
  const fetchCourseDetails = async () => {
    try {
      const { data } = await axios.get(`${serverUrl}/api/course/${courseId}`, {
        withCredentials: true,
      });

      if (data.success && data.course) {
        const c = data.course;
        setTitle(c.title || c.courseTitle || "");
        setSubTitle(c.subTitle || "");
        setDescription(c.description || "");
        setCategory(c.category || "Web Development");
        setPrice(c.price ?? c.coursePrice ?? 0);
        setIsPublished(c.isPublished || false);
        setThumbnailPreview(c.thumbnail || c.courseThumbnail || "");
        setLectures(c.lectures || []);
      }
    } catch (error) {
      toast.error("Failed to fetch course details");
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  // Handle Thumbnail Select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Submit Course Updates
  const handleCourseUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("courseTitle", title);
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("coursePrice", price);
    formData.append("isPublished", isPublished);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
      formData.append("courseThumbnail", thumbnail);
    }

    try {
      const { data } = await axios.put(
        `${serverUrl}/api/course/${courseId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message || "Course updated successfully!");
        fetchCourseDetails();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500">
      <Nav />

      <div className="max-w-6xl mx-auto pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/viewcourse/${courseId}`)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Preview Course</span>
            </button>

            <button
              onClick={() => navigate(`/createlecture/${courseId}`)}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Lecture</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Settings (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <form onSubmit={handleCourseUpdate} className="space-y-6">
              {/* Basic Metadata Box */}
              <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-5">
                <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span>Course Information</span>
                </h2>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Subtitle / Summary
                  </label>
                  <input
                    type="text"
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                    placeholder="Brief headline summarizing what students will learn"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Full course outline and requirements..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Pricing & Publication Box */}
              <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-5">
                <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  <span>Pricing & Visibility Status</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Publication Status
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsPublished(!isPublished)}
                      className={`w-full py-3 px-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        isPublished
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      {isPublished ? "Published (Live & Visible)" : "Draft (Hidden from Catalog)"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Saving Changes..." : "Save Course Updates"}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar: Thumbnail Upload & Lecture List (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Thumbnail Box */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                <span>Course Cover Image</span>
              </h3>

              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-slate-500">No Image Selected</span>
                )}
              </div>

              <label className="block w-full text-center px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer transition-all border border-slate-700">
                <span>Upload New Cover</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Curriculum Lectures Quick Box */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-indigo-400" />
                  <span>Curriculum ({lectures.length})</span>
                </h3>
                <button
                  onClick={() => navigate(`/createlecture/${courseId}`)}
                  className="text-xs text-indigo-400 hover:underline font-bold"
                >
                  + Add
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {lectures.length > 0 ? (
                  lectures.map((lec, idx) => (
                    <div
                      key={lec._id || idx}
                      className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-200 truncate pr-2">
                        {idx + 1}. {lec.lectureTitle || lec.title}
                      </span>
                      <button
                        onClick={() => navigate(`/editlecture/${courseId}/${lec._id}`)}
                        className="text-indigo-400 hover:text-indigo-300 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 cursor-pointer"
                        title="Edit Lecture"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic text-center py-4">
                    No lectures added yet. Click "+ Add" above to upload your first video!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AddCourses;