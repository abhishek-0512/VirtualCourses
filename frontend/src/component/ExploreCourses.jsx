import React from "react";
import { 
  Code2, 
  Palette, 
  Smartphone, 
  ShieldCheck, 
  Bot, 
  Database, 
  BarChart3, 
  Sparkles, 
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function ExploreCourses() {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Web Development",
      icon: Code2,
      coursesCount: "120+ Courses",
      gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
      border: "hover:border-blue-500/50",
      iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    },
    {
      name: "UI/UX Design",
      icon: Palette,
      coursesCount: "85+ Courses",
      gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
      border: "hover:border-purple-500/50",
      iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    },
    {
      name: "App Development",
      icon: Smartphone,
      coursesCount: "64+ Courses",
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      border: "hover:border-emerald-500/50",
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      name: "Cybersecurity",
      icon: ShieldCheck,
      coursesCount: "42+ Courses",
      gradient: "from-rose-500/20 via-red-500/10 to-transparent",
      border: "hover:border-rose-500/50",
      iconColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    },
    {
      name: "AI & Machine Learning",
      icon: Bot,
      coursesCount: "95+ Courses",
      gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      border: "hover:border-amber-500/50",
      iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    },
    {
      name: "Data Science",
      icon: Database,
      coursesCount: "78+ Courses",
      gradient: "from-cyan-500/20 via-sky-500/10 to-transparent",
      border: "hover:border-cyan-500/50",
      iconColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      name: "Data Analytics",
      icon: BarChart3,
      coursesCount: "53+ Courses",
      gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
      border: "hover:border-violet-500/50",
      iconColor: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    },
    {
      name: "AI Tools & Prompting",
      icon: Sparkles,
      coursesCount: "40+ Courses",
      gradient: "from-indigo-500/20 via-blue-500/10 to-transparent",
      border: "hover:border-indigo-500/50",
      iconColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    },
  ];

  const handleCategoryClick = (catName) => {
    navigate(`/allcourses?category=${encodeURIComponent(catName)}`);
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300 mb-3 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Browse Categories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore Popular{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-amber-300 bg-clip-text text-transparent">
                Learning Paths
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Choose from structured roadmaps crafted to take you from foundational basics to industry mastery.
            </p>
          </div>

          <button
            onClick={() => navigate("/allcourses")}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 group cursor-pointer self-start md:self-auto"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => handleCategoryClick(cat.name)}
                className={`group relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer ${cat.border}`}
              >
                {/* Background Ambient Glow on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />

                <div className="flex flex-col h-full justify-between gap-6">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${cat.iconColor} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-950/60 border border-slate-800 px-2.5 py-1 rounded-full">
                      {cat.coursesCount}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {cat.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-2 font-medium group-hover:text-slate-200">
                      <span>Browse path</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-indigo-400" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ExploreCourses;
