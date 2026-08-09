import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SiViaplay } from "react-icons/si";
import { Sparkles, BookOpen, ArrowRight } from "lucide-react";
import Card from "./Card";

function Cardspage() {
  const navigate = useNavigate();
  const { courseData = [] } = useSelector((state) => state.course);
  const [popularCourses, setPopularCourses] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filterTabs = ["All", "Web Development", "AI & Machine Learning", "UI/UX Design", "Data Science"];

  useEffect(() => {
    if (Array.isArray(courseData) && courseData.length > 0) {
      let list = courseData;
      if (selectedFilter !== "All") {
        list = courseData.filter(
          (c) => c.category?.toLowerCase() === selectedFilter.toLowerCase()
        );
      }
      setPopularCourses(list.slice(0, 6));
    } else {
      setPopularCourses([]);
    }
  }, [courseData, selectedFilter]);

  return (
    <section className="relative w-full px-4 py-20 bg-slate-950/70">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Header Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-300 mb-3 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Trending Learning Paths</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center text-white tracking-tight">
          Explore Our{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-amber-300 bg-clip-text text-transparent">
            Popular Courses
          </span>
        </h2>

        {/* Subtitle */}
        <p className="max-w-2xl text-center text-slate-400 mt-3 mb-8 text-sm sm:text-base leading-relaxed">
          Top-rated video courses designed with real-world projects, expert mentoring, and instant AI tutor support.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === tab
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {popularCourses.length > 0 ? (
            popularCourses.map((course) => (
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
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 rounded-3xl border border-slate-800 bg-slate-900/40 text-center backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                No Courses in this Category
              </h3>
              <p className="text-slate-400 text-xs max-w-md mb-6">
                Browse our full catalog to find courses across all disciplines.
              </p>
              <button
                onClick={() => navigate("/allcourses")}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-500 transition-all cursor-pointer"
              >
                Browse Full Catalog
              </button>
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="mt-14 text-center">
          <button
            onClick={() => navigate("/allcourses")}
            className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl shadow-indigo-500/25 transition-all hover:scale-105 hover:shadow-indigo-500/40 active:scale-95 cursor-pointer"
          >
            <span>Explore All 20,000+ Courses</span>
            <SiViaplay className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
}

export default Cardspage;