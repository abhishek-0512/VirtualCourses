import React from "react";
import { 
  BookOpen, 
  Infinity as InfinityIcon, 
  Sparkles, 
  Headphones, 
  Users, 
  Award,
  ShieldCheck 
} from "lucide-react";

function Logos() {
  const highlights = [
    {
      icon: BookOpen,
      title: "20,000+ Courses",
      subtitle: "Comprehensive curriculum",
      color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
    },
    {
      icon: InfinityIcon,
      title: "Lifetime Access",
      subtitle: "Learn at your own pace",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      icon: Award,
      title: "Verified Certificates",
      subtitle: "Industry recognized",
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
    },
    {
      icon: Headphones,
      title: "24/7 AI Voice Tutor",
      subtitle: "Instant doubt resolution",
      color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
    },
    {
      icon: Users,
      title: "Global Community",
      subtitle: "50,000+ Active learners",
      color: "from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30",
    },
  ];

  return (
    <section className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white tracking-wide truncate group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {item.subtitle}
                    </p>
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

export default Logos;
