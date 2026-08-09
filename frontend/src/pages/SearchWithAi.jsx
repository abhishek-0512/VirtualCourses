import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Sparkles, Send, ArrowLeft, Bot, BookOpen, Lightbulb, Compass } from "lucide-react";
import { serverUrl } from "../App";
import Nav from "../component/Nav";
import Footer from "../component/Footer";
import Card from "../component/Card";

function SearchWithAi() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const samplePrompts = [
    "Find beginner React and full-stack web development courses",
    "What are the best courses to master Machine Learning with Python?",
    "Show me UI/UX Design courses with Figma and real-world projects",
    "Which courses cover backend API design and cloud deployment?",
  ];

  const handleSearch = async (searchQuery) => {
    const textToSearch = searchQuery || query;
    if (!textToSearch.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/ai/search`,
        { input: textToSearch, query: textToSearch },
        { withCredentials: true }
      );

      if (data.success || data.courses || data.matchedCourses) {
        setResponse({
          message: data.message || data.aiResponse || "Here are the top courses matching your learning goals:",
          courses: data.matchedCourses || data.courses || [],
        });
      }
    } catch (error) {
      console.error("AI Search Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500">
      <Nav />

      <div className="max-w-5xl mx-auto pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/allcourses")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to All Courses</span>
        </button>

        {/* AI Hero Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-300 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>Powered by Gemini Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Discover What to Learn{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-amber-300 bg-clip-text text-transparent">
              with Gemini AI
            </span>
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Tell us your career goal, current skill level, or what you want to build, and our AI mentor will recommend tailored learning paths.
          </p>
        </div>

        {/* Prompt Input Box */}
        <div className="relative max-w-3xl mx-auto mb-10">
          <div className="relative flex items-center rounded-3xl border border-slate-800 bg-slate-900/80 p-2 backdrop-blur-2xl shadow-2xl focus-within:border-indigo-500 transition-all">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. I want to build full-stack web applications with React and Node.js..."
              className="w-full bg-transparent px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer shrink-0"
            >
              <span>{loading ? "Searching..." : "Ask Gemini"}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Try asking:</span>
            </span>
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(prompt);
                  handleSearch(prompt);
                }}
                className="text-[11px] bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-indigo-300 px-3 py-1.5 rounded-full transition-all cursor-pointer"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold">Gemini AI is curating recommendations...</p>
          </div>
        )}

        {/* AI Response Block */}
        {response && (
          <div className="space-y-8 animate-fadeIn">
            {/* Answer Card */}
            <div className="p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl shadow-2xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Gemini AI Guidance</h3>
                  <p className="text-[10px] text-slate-400">Personalized curriculum analysis</p>
                </div>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line pt-2">
                {response.message}
              </p>
            </div>

            {/* Matching Courses Grid */}
            {response.courses?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>Recommended Courses ({response.courses.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {response.courses.map((course) => (
                    <Card
                      key={course._id}
                      id={course._id}
                      thumbnail={course.thumbnail || course.courseThumbnail}
                      title={course.title || course.courseTitle}
                      price={course.price ?? course.coursePrice}
                      category={course.category}
                      reviews={course.reviews}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default SearchWithAi;