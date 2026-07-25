import React from "react";
import { useNavigate } from "react-router-dom";
import { SiViaplay } from "react-icons/si";
import { Sparkles, Compass, Rocket, ShieldCheck, ArrowRight } from "lucide-react";

import Nav from "../component/Nav";
import Logos from "../component/Logos";
import ExploreCourses from "../component/ExploreCourses";
import Cardspage from "../component/Cardspage";
import About from "../component/About";
import ReviewPage from "../component/ReviewPage";
import Footer from "../component/Footer";

import home from "../assets/home1.jpg";
import ai from "../assets/ai.png";
import ai1 from "../assets/SearchAi.png";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <Nav />

      <div className="w-full">
        {/* ================= HERO SECTION ================= */}
        <section className="relative isolate overflow-hidden">
          {/* Background Image with Dark Vignette Overlay */}
          <img
            src={home}
            alt="Home Banner"
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35 filter brightness-75 transition-scale duration-1000 hover:scale-105"
          />

          {/* Gradient Overlays for Ambient Lighting */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />
          <div className="absolute -top-40 -left-40 -z-10 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />
          <div className="absolute top-1/3 -right-40 -z-10 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

          <div className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-6 pt-32 pb-20 lg:px-8">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-indigo-300 backdrop-blur-md transition-all hover:border-indigo-500/50">
                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                <span>AI-Powered Learning • Creator-First Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1]">
                Learn faster, teach smarter, and grow with{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-amber-300 bg-clip-text text-transparent">
                  confidence.
                </span>
              </h1>

              {/* Body Text */}
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl font-normal">
                Discover premium courses, build real-world expertise, and turn learning into momentum with a platform built for students and creators alike.
              </p>

              {/* Call-to-Action Buttons */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate("/allcourses")}
                  className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98]"
                >
                  <span>Explore courses</span>
                  <SiViaplay className="text-lg transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => navigate("/searchwithai")}
                  className="group flex items-center gap-3 rounded-full border border-slate-700/80 bg-slate-900/60 px-7 py-3.5 font-semibold text-slate-200 backdrop-blur-md transition-all hover:border-indigo-500/50 hover:bg-slate-800/80 hover:text-white hover:shadow-lg active:scale-[0.98]"
                >
                  <span>Search with AI</span>
                  <img
                    src={ai}
                    alt="AI icon"
                    className="hidden h-6 w-6 rounded-full object-cover lg:block ring-2 ring-indigo-500/30"
                  />
                  <img
                    src={ai1}
                    alt="AI icon"
                    className="h-6 w-6 rounded-full object-cover lg:hidden ring-2 ring-indigo-500/30"
                  />
                </button>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="mt-16 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {[
                {
                  icon: Compass,
                  title: "100+ Guided Paths",
                  subtitle: "Curated roadmaps from beginner to advanced",
                },
                {
                  icon: Sparkles,
                  title: "Live AI Search",
                  subtitle: "Instantly discover topics, code, and insights",
                },
                {
                  icon: Rocket,
                  title: "Creator Studio",
                  subtitle: "Publish courses and monetize your knowledge",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-indigo-500/10"
                >
                  <div className="mb-3 inline-flex rounded-xl bg-indigo-500/10 p-2.5 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= BANNER / VALUE PROP SECTION ================= */}
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 p-8 shadow-2xl backdrop-blur-md sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Why Learners Choose Us</span>
                </div>
                <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
                  Everything you need to move from curiosity to mastery.
                </h2>
              </div>

              <div className="inline-flex items-center gap-2 self-start rounded-full bg-indigo-600/20 border border-indigo-500/30 px-5 py-2.5 text-sm font-semibold text-indigo-300 backdrop-blur lg:self-auto">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
                </span>
                Trusted by 50,000+ Students & Educators
              </div>
            </div>
          </div>
        </section>

        {/* Sub-Components */}
        <Logos />
        <ExploreCourses />
        <Cardspage />
        <About />
        <ReviewPage />
        <Footer />
      </div>
    </div>
  );
}

export default Home;