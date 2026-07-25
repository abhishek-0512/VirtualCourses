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
  Image as ImageIcon 
} from "lucide-react";
import { serverUrl } from "../../App";
import Nav from "../../component/Nav";

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
        setTitle(c.title || "");
        setSubTitle(c.subTitle || "");
        setDescription(c.description || "");
        setCategory(c.category || "Web Development");
        setPrice(c.price || 0);
        setIsPublished(c.isPublished || false);
        setThumbnailPreview(c.thumbnail || "");
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
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("isPublished", isPublished);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Nav />

      <div className="max-w-5xl mx-auto pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Dashboard</span>
          </button>

          <button
            onClick={() => navigate(`/createlecture/${courseId}`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Lecture</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Settings */}
          <div className="lg:col-span-8 space-y-6">
            <form onSubmit={handleCourseUpdate} className="space-y-6">
              {/* Basic Metadata Box */}
              <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span>Course Details</span>
                </h2>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                    placeholder="Brief headline summarizing what students learn"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
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
                    placeholder="Full course outline and prerequisites..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Pricing & Publication Box */}
              <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  <span>Pricing & Status</span>
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Publication Status
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsPublished(!isPublished)}
                      className={`w-full py-3 px-4 rounded-2xl border text-xs font-bold transition-all ${
                        isPublished
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      {isPublished ? "Published (Visible)" : "Draft (Hidden)"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all"
                >
                  {loading ? "Saving Changes..." : "Save Course Settings"}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar: Thumbnail Upload & Lecture List */}
          <div className="lg:col-span-4 space-y-6">
            {/* Thumbnail Box */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                <span>Course Thumbnail</span>
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

              <label className="block w-full text-center px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer transition-all">
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
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-indigo-400" />
                  <span>Lectures ({lectures.length})</span>
                </h3>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {lectures.length > 0 ? (
                  lectures.map((lec, idx) => (
                    <div
                      key={lec._id || idx}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-slate-200 line-clamp-1">
                        {idx + 1}. {lec.lectureTitle}
                      </span>
                      <button
                        onClick={() => navigate(`/editlecture/${courseId}/${lec._id}`)}
                        className="text-indigo-400 hover:text-indigo-300 p-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic text-center py-2">
                    No lectures added yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCourses;