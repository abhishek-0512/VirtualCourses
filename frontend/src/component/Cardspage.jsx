import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SiViaplay } from "react-icons/si";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";
import Card from "./Card";

function Cardspage() {
  const navigate = useNavigate();
  const { courseData = [] } = useSelector((state) => state.course);
  const [popularCourses, setPopularCourses] = useState([]);

  useEffect(() => {
    if (Array.isArray(courseData)) {
      setPopularCourses(courseData.slice(0, 6));
    } else {
      setPopularCourses([]);
    }
  }, [courseData]);

  return (
    <section className="relative w-full px-4 py-16 md:py-24 bg-slate-950/50">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Header Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Top Rated Content</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-center text-white tracking-tight">
          Explore Our{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-amber-300 bg-clip-text text-transparent">
            Popular Courses
          </span>
        </h2>

        {/* Subtitle */}
        <p className="max-w-2xl text-center text-slate-400 mt-4 mb-12 text-base md:text-lg leading-relaxed">
          Master in-demand skills with top-rated learning paths designed by industry experts in development, AI, design, and business.
        </p>

        {/* Course Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
          {popularCourses.length > 0 ? (
            popularCourses.map((course) => (
              <Card
                key={course._id}
                id={course._id}
                thumbnail={course.thumbnail}
                title={course.title}
                price={course.price}
                category={course.category}
                reviews={course.reviews}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 rounded-3xl border border-slate-800 bg-slate-900/40 text-center backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No Courses Available Yet
              </h3>
              <p className="text-slate-400 text-sm max-w-md mb-6">
                Check back soon or explore our full catalog for upcoming courses.
              </p>
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="mt-14 text-center">
          <button
            onClick={() => navigate("/allcourses")}
            className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 hover:shadow-indigo-500/40 active:scale-95"
          >
            <span>Explore All Courses</span>
            <SiViaplay className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
}

export default Cardspage;