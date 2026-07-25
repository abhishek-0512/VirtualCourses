import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react" ;
import { useSelector } from "react-redux";
import { 
  PlayCircle, 
  CheckCircle2, 
  ArrowLeft, 
  ChevronRight, 
  BookOpen, 
  Sparkles,
  Menu,
  X,
  FileText
} from "lucide-react";
import Nav from "../component/Nav";

function ViewLecture() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courseData = [] } = useSelector((state) => state.course);

  const [course, setCourse] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const foundCourse = courseData.find((item) => item._id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      if (foundCourse.lectures?.length > 0) {
        setCurrentLecture(foundCourse.lectures[0]);
      }
    }
  }, [courseId, courseData]);

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-lg font-medium">Loading Learning Environment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Learning Header Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/viewcourse/${courseId}`)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white line-clamp-1">
              {course.title}
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              {course.lectures?.length || 0} Total Modules
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all"
        >
          {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>{isSidebarOpen ? "Hide Sidebar" : "Course Content"}</span>
        </button>
      </header>

      {/* Main Learning Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Stage Container */}
        <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto w-full space-y-6">
            {/* Video Player */}
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
              {currentLecture?.videoUrl ? (
                <video
                  src={currentLecture.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <PlayCircle className="w-16 h-16 text-slate-700 mb-3" />
                  <p className="text-slate-400 text-sm font-medium">
                    Select a lecture from the curriculum sidebar to start watching.
                  </p>
                </div>
              )}
            </div>

            {/* Lecture Meta */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <h2 className="text-xl font-bold text-white">
                  {currentLecture?.lectureTitle || "No Lecture Selected"}
                </h2>
                <span className="text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full font-semibold">
                  Playing Now
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {currentLecture?.description || "No description provided for this module."}
              </p>
            </div>
          </div>
        </main>

        {/* Collapsible Playlist Sidebar */}
        <aside
          className={`w-80 sm:w-96 border-l border-slate-800 bg-slate-900 flex flex-col transition-all duration-300 ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full hidden"
          }`}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Course Curriculum</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {course.lectures?.length || 0} Lessons
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {course.lectures?.map((lecture, idx) => {
              const isActive = currentLecture?._id === lecture._id;
              return (
                <button
                  key={lecture._id || idx}
                  onClick={() => setCurrentLecture(lecture)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition-all ${
                    isActive
                      ? "bg-indigo-600/20 border border-indigo-500/50 text-white shadow-md"
                      : "bg-slate-950/40 border border-slate-800/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3 pr-2">
                    <PlayCircle className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                    <div>
                      <p className="text-xs font-bold leading-snug line-clamp-2">
                        {idx + 1}. {lecture.lectureTitle}
                      </p>
                    </div>
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ViewLecture;