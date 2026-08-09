import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Sparkles, 
  BookOpen, 
  Search, 
  ArrowLeft, 
  SlidersHorizontal, 
  Grid, 
  List, 
  X, 
  RotateCcw,
  Star,
  CheckCircle,
  Layers,
  DollarSign
} from "lucide-react";
import Nav from "../component/Nav";
import Footer from "../component/Footer";
import Card from "../component/Card";
import useGetCourseData from "../customHooks/getCouseData";

function AllCourses() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Fetch courses into Redux store
  useGetCourseData();

  const { courseData = [] } = useSelector((state) => state.course);

  const initialCategory = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All"); // All | Free | Paid
  const [sortBy, setSortBy] = useState("popular"); // popular | rating | price-asc | price-desc | newest
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync with URL query parameter
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Extract unique categories
  const categories = [
    "All",
    ...new Set(
      courseData
        .map((c) => c.category)
        .filter((cat) => Boolean(cat) && cat.trim() !== "")
    ),
  ];

  const levels = ["All", "Beginner", "Medium", "Advance"];
  const priceFilters = ["All", "Free", "Paid"];

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSelectedLevel("All");
    setSelectedPrice("All");
    setSortBy("popular");
    setSearchQuery("");
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredCourses = courseData
    .filter((course) => {
      const title = (course.courseTitle || course.title || "").toLowerCase();
      const desc = (course.subTitle || course.description || "").toLowerCase();
      const category = course.category || "";
      const level = course.courseLevel || course.level || "Beginner";
      const price = course.coursePrice ?? course.price ?? 0;

      // Category filter
      const matchesCategory =
        selectedCategory === "All" ||
        category.toLowerCase() === selectedCategory.toLowerCase();

      // Search filter
      const matchesSearch =
        !searchQuery.trim() ||
        title.includes(searchQuery.toLowerCase()) ||
        desc.includes(searchQuery.toLowerCase()) ||
        category.toLowerCase().includes(searchQuery.toLowerCase());

      // Level filter
      const matchesLevel =
        selectedLevel === "All" ||
        level.toLowerCase() === selectedLevel.toLowerCase();

      // Price filter
      const matchesPrice =
        selectedPrice === "All" ||
        (selectedPrice === "Free" && price === 0) ||
        (selectedPrice === "Paid" && price > 0);

      return matchesCategory && matchesSearch && matchesLevel && matchesPrice;
    })
    .sort((a, b) => {
      const priceA = a.coursePrice ?? a.price ?? 0;
      const priceB = b.coursePrice ?? b.price ?? 0;

      const ratingA =
        a.reviews?.length > 0
          ? a.reviews.reduce((acc, r) => acc + r.rating, 0) / a.reviews.length
          : 5;
      const ratingB =
        b.reviews?.length > 0
          ? b.reviews.reduce((acc, r) => acc + r.rating, 0) / b.reviews.length
          : 5;

      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      if (sortBy === "rating") return ratingB - ratingA;
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      // default: popular (enrolled students count / reviews count)
      return (b.enrolledStudents?.length || 0) - (a.enrolledStudents?.length || 0);
    });

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedLevel !== "All" ||
    selectedPrice !== "All" ||
    searchQuery.trim() !== "";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500">
      <Nav />

      <div className="max-w-7xl mx-auto pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-800/80">
          <div>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-3 group cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </button>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Course Catalog & Learning Paths
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-2xl">
              Master industry-relevant skills with hands-on projects, interactive video lessons, and 24/7 AI tutor guidance.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="inline-flex items-center gap-2 self-start md:self-auto rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-bold text-indigo-300 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{courseData.length} Courses Available</span>
          </div>
        </div>

        {/* Toolbar: Search, Sort, View Toggle, Mobile Filter Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-slate-900/60 border border-slate-800 p-4 rounded-3xl backdrop-blur-xl">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, skills, or topics..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls: Sort Dropdown, View Toggle, Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Filters</span>
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* View Mode Grid/List Switcher */}
            <div className="hidden sm:flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === "list"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 animate-fadeIn">
            <span className="text-xs text-slate-400 font-semibold mr-1">
              Active Filters:
            </span>
            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1 bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full">
                <span>Category: {selectedCategory}</span>
                <X
                  className="w-3.5 h-3.5 cursor-pointer hover:text-white"
                  onClick={() => setSelectedCategory("All")}
                />
              </span>
            )}
            {selectedLevel !== "All" && (
              <span className="inline-flex items-center gap-1 bg-violet-600/20 border border-violet-500/40 text-violet-300 text-xs font-semibold px-3 py-1 rounded-full">
                <span>Level: {selectedLevel}</span>
                <X
                  className="w-3.5 h-3.5 cursor-pointer hover:text-white"
                  onClick={() => setSelectedLevel("All")}
                />
              </span>
            )}
            {selectedPrice !== "All" && (
              <span className="inline-flex items-center gap-1 bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full">
                <span>Price: {selectedPrice}</span>
                <X
                  className="w-3.5 h-3.5 cursor-pointer hover:text-white"
                  onClick={() => setSelectedPrice("All")}
                />
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold px-3 py-1 rounded-full">
                <span>Query: "{searchQuery}"</span>
                <X
                  className="w-3.5 h-3.5 cursor-pointer hover:text-white"
                  onClick={() => setSearchQuery("")}
                />
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 ml-2 font-bold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>
        )}

        {/* Main Grid: Sidebar Filters (3 cols) + Results (9 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Desktop Left Sidebar Filters */}
          <aside className={`lg:col-span-3 space-y-6 ${mobileFilterOpen ? "block" : "hidden lg:block"}`}>
            
            {/* Category Filter Card */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Category
                </h3>
                {selectedCategory !== "All" && (
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="text-[11px] text-indigo-400 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                      selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? "bg-indigo-600 text-white shadow-md font-bold"
                        : "bg-slate-950/40 text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    {selectedCategory.toLowerCase() === cat.toLowerCase() && (
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Filter Card */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Difficulty Level
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {levels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                      selectedLevel === lvl
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Card */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Price
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {priceFilters.map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPrice(p)}
                    className={`p-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                      selectedPrice === p
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Right Main Course Results (9 cols) */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Results Counter */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>
                Showing <strong className="text-white">{filteredCourses.length}</strong> of{" "}
                <strong className="text-white">{courseData.length}</strong> total courses
              </span>
            </div>

            {filteredCourses.length > 0 ? (
              viewMode === "grid" ? (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <Card
                      key={course._id}
                      id={course._id}
                      thumbnail={course.thumbnail || course.courseThumbnail}
                      title={course.title || course.courseTitle}
                      price={course.price ?? course.coursePrice}
                      category={course.category}
                      level={course.courseLevel || course.level}
                      lectures={course.lectures}
                      reviews={course.reviews}
                    />
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-4">
                  {filteredCourses.map((course) => {
                    const price = course.price ?? course.coursePrice ?? 0;
                    const title = course.title || course.courseTitle || "Untitled Course";
                    const thumbnail = course.thumbnail || course.courseThumbnail;
                    const category = course.category || "General";
                    const level = course.courseLevel || course.level || "Beginner";
                    const lecturesCount = course.lectures?.length || 0;

                    return (
                      <div
                        key={course._id}
                        onClick={() => navigate(`/viewcourse/${course._id}`)}
                        className="group flex flex-col sm:flex-row items-center gap-5 p-4 rounded-3xl border border-slate-800 bg-slate-900/60 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all cursor-pointer shadow-xl backdrop-blur-md"
                      >
                        <img
                          src={thumbnail || "https://placehold.co/600x400"}
                          alt={title}
                          className="w-full sm:w-56 aspect-video rounded-2xl object-cover border border-slate-800"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0 space-y-2 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                              {category}
                            </span>
                            <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                              {level}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                            {title}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {course.subTitle || course.description || "Master new skills with hands-on learning."}
                          </p>
                          <div className="flex items-center gap-4 text-xs pt-1">
                            <span className="text-slate-400">
                              {lecturesCount} Lessons Included
                            </span>
                            <span className="font-extrabold text-emerald-400">
                              {price > 0 ? `₹${price}` : "FREE"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              /* Empty State */
              <div className="p-16 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-4">
                <BookOpen className="w-12 h-12 text-slate-700 mx-auto" />
                <h3 className="text-lg font-bold text-white">No Matching Courses Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  We couldn't find any courses matching your filter selections. Try clearing your search query or adjusting your filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-500 transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AllCourses;