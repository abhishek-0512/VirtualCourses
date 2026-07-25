import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Sparkles, Send, ArrowLeft, Bot, User, Compass, BookOpen } from "lucide-react";
import { serverUrl } from "../App";
import Nav from "../component/Nav";
import Card from "../component/Card";

function SearchWithAi() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const samplePrompts = [
    "Find me beginner React and web development courses",
    "What are the highest rated backend API tutorials?",
    "Show courses that cover full-stack JavaScript",
  ];

  const handleSearch = async (searchQuery) => {
    const textToSearch = searchQuery || query;
    if (!textToSearch.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/ai/search`,
        { query: textToSearch },
        { withCredentials: true }
      );

      if (data.success) {
        setResponse(data);
      }
    } catch (error) {
      console.error("AI Search Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Nav />

      <div className="max-w-5xl mx-auto pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/allcourses")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Courses</span>
        </button>

        {/* AI Hero Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-300 mb-4 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>Powered by Gemini AI</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ask AI Anything About{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-amber-300 bg-clip-text text-transparent">
              Your Learning
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Describe what skills you want to build, and our AI assistant will guide you directly to the best matching courses.
          </p>
        </div>

        {/* Prompt Input Box */}
        <div className="relative max-w-3xl mx-auto mb-8">
          <div className="relative flex items-center rounded-2xl border border-slate-800 bg-slate-900/80 p-2 backdrop-blur-xl shadow-2xl focus-within:border-indigo-500/60 transition-all">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. Find me a course on full-stack web development..."
              className="w-full bg-transparent px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all"
            >
              <span>{loading ? "Searching..." : "Ask AI"}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-xs text-slate-500 font-medium">Try asking:</span>
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setQuery(prompt);
                  handleSearch(prompt);
                }}
                className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-indigo-300 px-3 py-1.5 rounded-full transition-all"
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
            <p className="text-sm font-medium">Analyzing catalog with Gemini AI...</p>
          </div>
        )}

        {/* AI Response Block */}
        {response && (
          <div className="space-y-8 animate-fadeIn">
            {/* Answer Card */}
            <div className="p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">AI Assistant Insights</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {response.message || response.aiResponse}
              </p>
            </div>

            {/* Matching Courses Grid */}
            {response.matchedCourses?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span>Recommended Courses</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {response.matchedCourses.map((course) => (
                    <Card
                      key={course._id}
                      id={course._id}
                      thumbnail={course.thumbnail}
                      title={course.title}
                      price={course.price}
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
    </div>
  );
}

export default SearchWithAi;