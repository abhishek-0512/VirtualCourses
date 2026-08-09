import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../../App";
import { setLectureData } from "../../redux/lectureSlice";
import { toast } from "react-toastify";
import { 
  ArrowLeft, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  Video, 
  Loader2, 
  Sparkles 
} from "lucide-react";
import Nav from "../../component/Nav";
import Footer from "../../component/Footer";

function EditLecture() {
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { lectureData = [] } = useSelector((state) => state.lecture);

  const selectedLecture = lectureData.find(
    (lecture) => lecture._id === lectureId
  );

  const [lectureTitle, setLectureTitle] = useState(
    selectedLecture?.lectureTitle || selectedLecture?.title || ""
  );
  const [videoFile, setVideoFile] = useState(null);
  const [isPreviewFree, setIsPreviewFree] = useState(
    selectedLecture?.isPreviewFree || selectedLecture?.isFree || false
  );

  // UPDATE LECTURE
  const editLecture = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("lectureTitle", lectureTitle);
      if (videoFile) {
        formData.append("videoUrl", videoFile);
        formData.append("video", videoFile);
      }
      formData.append("isPreviewFree", isPreviewFree);

      const { data } = await axios.put(
        `${serverUrl}/api/lecture/${lectureId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      const updatedLectures = lectureData.map((lecture) =>
        lecture._id === lectureId ? data.lecture || data : lecture
      );

      dispatch(setLectureData(updatedLectures));
      toast.success("Lecture updated successfully!");
      navigate(`/addcourses/${courseId}`);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Lecture update failed");
    } finally {
      setLoading(false);
    }
  };

  // DELETE LECTURE
  const removeLecture = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this lecture?")) return;
    setLoading1(true);

    try {
      await axios.delete(`${serverUrl}/api/lecture/${lectureId}`, {
        withCredentials: true,
      });

      const updatedLectures = lectureData.filter(
        (lecture) => lecture._id !== lectureId
      );

      dispatch(setLectureData(updatedLectures));
      toast.success("Lecture removed");
      navigate(`/addcourses/${courseId}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove lecture");
    } finally {
      setLoading1(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500">
      <Nav />

      <div className="max-w-2xl mx-auto pt-24 pb-20 px-4 sm:px-6">
        
        {/* Back Link */}
        <button
          onClick={() => navigate(`/addcourses/${courseId}`)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Course Curriculum</span>
        </button>

        <div className="p-8 sm:p-10 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Edit Lecture Module</h1>
                <p className="text-xs text-slate-400">Update video file or free preview status.</p>
              </div>
            </div>

            <button
              onClick={removeLecture}
              disabled={loading1}
              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Delete Lecture"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>

          <form onSubmit={editLecture} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Lecture Title
              </label>
              <input
                type="text"
                value={lectureTitle}
                onChange={(e) => setLectureTitle(e.target.value)}
                placeholder="e.g. Module 2: State Management"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Replace Video File (Optional)
              </label>
              <div className="relative p-5 border border-dashed rounded-2xl bg-slate-950/60 border-slate-800 hover:border-indigo-500/50 text-center cursor-pointer transition-all">
                {videoFile ? (
                  <div className="flex flex-col items-center gap-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <p className="text-xs text-white font-semibold truncate max-w-sm">
                      {videoFile.name}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Upload className="w-6 h-6 text-slate-500" />
                    <p className="text-xs text-slate-400">Click to select replacement video</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input
                type="checkbox"
                id="previewEdit"
                checked={isPreviewFree}
                onChange={(e) => setIsPreviewFree(e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
              />
              <label htmlFor="previewEdit" className="text-xs font-semibold text-slate-300 cursor-pointer">
                Allow as Free Preview (Students can view without enrolling)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Lecture...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save Lecture Changes</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default EditLecture;