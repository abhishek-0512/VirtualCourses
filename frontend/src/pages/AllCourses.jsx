import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Sparkles, BookOpen, Search, ArrowLeft } from "lucide-react";
import Nav from "../component/Nav";
import useGetCourseData from "../customHooks/getCouseData";

function AllCourses() {
  const navigate = useNavigate();

  // Fetch courses into Redux store
  useGetCourseData();

  const { courseData = [] } = useSelector((state) => state.course);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract unique categories
  const categories = [
    "All",
    ...new Set(
      courseData
        .map((c) => c.category)
        .filter((cat) => Boolean(cat) && cat.trim() !== "")
    ),
  ];

  // Filter courses based on category selection and search query
  const filteredCourses = courseData.filter((course) => {
    const title = (course.courseTitle || course.title || "").toLowerCase();
    const category = course.category || "";

    const matchesCategory =
      selectedCategory === "All" || category === selectedCategory;
    const matchesSearch = title.includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Nav />

      <div className="max-w-7xl mx-auto pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 space-y-2">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-2 group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Home</span>
          </button>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            All Available Courses
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            Explore tech, business, and creative paths crafted by expert instructors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar Filters */}
          <div className="lg:col-span-3 space-y-6">
            {/* Smart Discovery / Search Box */}
            <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Search Courses</span>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Filter by Category */}
            <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Filter by Category
              </h3>

              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                      selectedCategory === cat
                        ? "bg-indigo-600 text-white font-bold"
                        : "bg-slate-950/50 text-slate-400 hover:text-white hover:bg-slate-800/50 border border-slate-800/50"
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Main Course Grid */}
          <div className="lg:col-span-9">
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => {
                  const title = course.courseTitle || course.title || "Untitled Course";
                  const thumbnail =
                    course.courseThumbnail ||
                    course.thumbnail ||
                    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop";
                  const price = course.coursePrice ?? course.price;
                  const category = course.category || "General";

                  return (
                    <div
                      key={course._id}
                      onClick={() => navigate(`/viewcourse/${course._id}`)}
                      className="cursor-pointer group relative bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between shadow-2xl hover:shadow-indigo-500/10"
                    >
                      <div>
                        {/* Course Thumbnail */}
                        <div className="relative aspect-video overflow-hidden bg-slate-800">
                          <img
                            src={thumbnail}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-800 text-indigo-300">
                            {category}
                          </span>
                        </div>

                        {/* Course Body */}
                        <div className="p-5 space-y-2">
                          <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-indigo-400 transition-colors">
                            {title}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2">
                            {course.subTitle || course.description || "Master new skills with this course."}
                          </p>
                        </div>
                      </div>

                      {/* Course Footer */}
                      <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/50 mt-4">
                        <span className="text-emerald-400 font-extrabold text-xs">
                          {price !== undefined && price !== null && price > 0 ? `$${price}` : "FREE"}
                        </span>
                        <span className="text-xs text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                          View Details &rarr;
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-16 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
                <BookOpen className="w-12 h-12 text-slate-700 mx-auto" />
                <h3 className="text-base font-bold text-white">No Courses Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try clearing your search query or selecting a different category filter.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllCourses;