import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Video, Upload, Sparkles, Film, CheckCircle2, Loader2 } from "lucide-react";
import { serverUrl } from "../../App";
import Nav from "../../component/Nav";

function CreateLecture() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [lectureTitle, setLectureTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [loading, setLoading] = useState(false);

  // Format bytes to readable MB/KB
  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lectureTitle.trim() || !video) {
      toast.error("Please provide both a title and a video file");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("lectureTitle", lectureTitle);
    formData.append("video", video);
    formData.append("isPreviewFree", isPreviewFree);

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/lecture/add/${courseId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success("Lecture added successfully!");
        navigate(`/addcourses/${courseId}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add lecture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Nav />

      <div className="max-w-3xl mx-auto pt-24 pb-20 px-4 sm:px-6">
        <button
          onClick={() => navigate(`/addcourses/${courseId}`)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Course Editor</span>
        </button>

        <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">
                Add New Lecture
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                Upload a video file and configure module permissions.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Lecture Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={lectureTitle}
                onChange={(e) => setLectureTitle(e.target.value)}
                placeholder="e.g. Module 1: Introduction to Variables"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Video File (MP4, WEBM, MOV) <span className="text-red-400">*</span>
              </label>
              <div className={`relative p-6 border-2 border-dashed rounded-2xl bg-slate-950/60 text-center transition-all cursor-pointer ${
                video ? "border-indigo-500 bg-indigo-950/10" : "border-slate-800 hover:border-indigo-500/50"
              }`}>
                {video ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
                    <p className="text-xs text-white font-bold truncate max-w-md">
                      {video.name}
                    </p>
                    <span className="text-[10px] text-indigo-400 font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30">
                      {formatFileSize(video.size)} • Click or drag to swap file
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-slate-500" />
                    <p className="text-xs text-slate-300 font-medium">
                      Click to select or drag video file here
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Supports MP4, WEBM, MOV (Max recommended size: 500MB)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideo(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input
                type="checkbox"
                id="preview"
                checked={isPreviewFree}
                onChange={(e) => setIsPreviewFree(e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
              />
              <label htmlFor="preview" className="text-xs font-semibold text-slate-300 cursor-pointer">
                Allow as Free Preview (Non-enrolled students can watch this video)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading Video to Cloud Stream...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Upload & Save Lecture</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateLecture;