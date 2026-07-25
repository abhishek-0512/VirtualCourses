import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  SlidersHorizontal, 
  Sparkles, 
  X, 
  RotateCcw,
  BookOpen,
  Check
} from "lucide-react";
import Card from "../component/Card.jsx";
import Nav from "../component/Nav";
import ai from "../assets/SearchAi.png";

function AllCourses() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [category, setCategory] = useState([]);

  const navigate = useNavigate();
  const { courseData = [] } = useSelector((state) => state.course);

  // Get dynamic categories from courses
  const categories = useMemo(() => {
    if (!Array.isArray(courseData)) return [];
    return [
      ...new Set(
        courseData
          .map((course) => course.category)
          .filter(Boolean)
      ),
    ];
  }, [courseData]);

  // Handle checkbox toggles
  const toggleCategory = (value) => {
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const clearFilters = () => {
    setCategory([]);
  };

  // Filter courses based on selected categories
  const filteredCourses = useMemo(() => {
    if (!Array.isArray(courseData)) return [];
    if (category.length === 0) return courseData;
    return courseData.filter((course) => category.includes(course.category));
  }, [category, courseData]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Nav />

      {/* Mobile Floating Filter Button */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <button
          onClick={() => setIsSidebarVisible((prev) => !prev)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold px-5 py-3 rounded-full shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filters</span>
          {category.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-indigo-600 text-xs font-bold flex items-center justify-center ml-1">
              {category.length}
            </span>
          )}
        </button>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {isSidebarVisible && (
        <div
          onClick={() => setIsSidebarVisible(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <div className="max-w-[1600px] mx-auto pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex gap-8">
        
        {/* Sidebar Filters */}
        <aside
          className={`fixed md:sticky top-0 md:top-24 left-0 h-full md:h-[calc(100vh-7rem)] w-72 bg-slate-900 border-r md:border border-slate-800 md:rounded-3xl p-6 shadow-2xl z-50 md:z-10 overflow-y-auto transition-transform duration-300 ease-in-out ${
            isSidebarVisible ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 flex flex-col justify-between`}
        >
          <div>
            {/* Sidebar Top Header */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-800">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Home</span>
              </button>

              <button
                onClick={() => setIsSidebarVisible(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Search CTA Box */}
            <div className="mt-6 mb-8 p-4 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/30">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Smart Discovery</span>
              </div>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Need personalized recommendations? Try our AI course match.
              </p>
              <button
                onClick={() => navigate("/searchwithai")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all group"
              >
                <span>Search with AI</span>
                <img
                  src={ai}
                  alt="AI icon"
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-white/30"
                />
              </button>
            </div>

            {/* Category Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white tracking-wide">
                Filter by Category
              </h2>
              {category.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Category List */}
            <div className="space-y-2">
              {categories.length > 0 ? (
                categories.map((item) => {
                  const isChecked = category.includes(item);
                  return (
                    <label
                      key={item}
                      onClick={() => toggleCategory(item)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                        isChecked
                          ? "bg-indigo-600/10 border-indigo-500/50 text-indigo-300"
                          : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-sm font-medium">{item}</span>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                          isChecked
                            ? "bg-indigo-500 border-indigo-500 text-white"
                            : "border-slate-700 bg-slate-900"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </label>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500 italic py-2">
                  No categories found.
                </p>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 text-center">
            Showing {filteredCourses.length} of {courseData.length} courses
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                All Available Courses
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Explore tech, business, and creative paths crafted by expert instructors.
              </p>
            </div>

            {/* Active Filters Bar */}
            {category.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Active:</span>
                {category.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full"
                  >
                    {cat}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-white"
                      onClick={() => toggleCategory(cat)}
                    />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Courses Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
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
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 rounded-3xl border border-slate-800 bg-slate-900/40 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400 mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No Courses Found
              </h3>
              <p className="text-slate-400 text-sm max-w-md mb-6">
                Try unticking some categories or search for another topic.
              </p>
              {category.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AllCourses;