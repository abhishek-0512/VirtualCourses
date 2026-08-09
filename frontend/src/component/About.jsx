import React from "react";
import about from "../assets/about.jpg";
import VideoPlayer from "./VideoPlayer";
import { 
  CheckCircle2, 
  Sparkles, 
  Users, 
  Award, 
  PlayCircle, 
  TrendingUp,
  BrainCircuit,
  ShieldCheck
} from "lucide-react";

function About() {
  const platformStats = [
    { label: "Active Learners", value: "50K+", icon: Users, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" },
    { label: "Completion Rate", value: "98.4%", icon: TrendingUp, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
    { label: "Verified Certificates", value: "24K+", icon: Award, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
    { label: "AI Interactions", value: "1.5M+", icon: BrainCircuit, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
  ];

  const keyFeatures = [
    { title: "24/7 AI Voice Companion", desc: "Ask questions anytime during lectures with natural vocal explanations." },
    { title: "Hands-on Interactive Quizzes", desc: "AI-generated lesson assessments to cement your understanding immediately." },
    { title: "Instructor Verified Certificates", desc: "Download verifiable, high-resolution PDF credentials upon completion." },
    { title: "Lifetime Unrestricted Access", desc: "Learn on your own schedule with zero time pressure or hidden subscriptions." },
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Ambient Background Light */}
      <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Media Side */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-900/60 p-2 backdrop-blur-xl shadow-2xl">
              <img
                src={about}
                alt="Learning Together"
                className="w-full h-[380px] sm:h-[440px] object-cover rounded-2xl filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent rounded-2xl" />

              {/* Floating Stat Card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-700/60 backdrop-blur-xl shadow-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Interactive Video Player</h4>
                    <p className="text-[11px] text-slate-400">AI-powered speech & notes</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <span>4.9 / 5.0 Rating</span>
                </div>
              </div>
            </div>

            {/* Optional preview player widget */}
            <div className="mt-4">
              <VideoPlayer />
            </div>
          </div>

          {/* Right Content Side */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300 mb-3 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next-Generation Education</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Designed to Accelerate Your{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-amber-300 bg-clip-text text-transparent">
                  Learning Velocity
                </span>
              </h2>

              <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
                Virtual Courses merges world-class instructional design with personalized Gemini AI assistance. Whether you are mastering full-stack software development, UI/UX design, or data science, you have an intelligent mentor beside you at every step.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {keyFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <h4 className="text-xs font-bold text-white">{feat.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Platform Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
              {platformStats.map((stat, idx) => {
                const StatIcon = stat.icon;
                return (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60 text-center">
                    <div className="text-xl sm:text-2xl font-black text-white">
                      {stat.value}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default About;