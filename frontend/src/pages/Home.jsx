import React from "react";
import { useNavigate } from "react-router-dom";
import { SiViaplay } from "react-icons/si";

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
    <>
      {/* Fixed Navbar */}
      <Nav />

      <div className="page-content-offset w-full bg-slate-50">

        {/* Hero */}
        <section className="relative isolate">

          <img
            src={home}
            alt="Home Banner"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_40%),linear-gradient(120deg,_rgba(2,6,23,0.95)_0%,_rgba(15,23,42,0.82)_45%,_rgba(15,23,42,0.7)_100%)]" />

          <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-28 lg:px-8">

            <div className="max-w-3xl">

              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium tracking-[0.2em] uppercase text-slate-200 backdrop-blur">
                AI-powered learning • creator-first platform
              </span>

              <h1 className="mt-8 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl">
                Learn faster, teach smarter, and grow with confidence.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Discover premium courses, build your expertise, and turn learning into momentum with a platform designed for both students and educators.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">

                <button
                  onClick={() => navigate("/allcourses")}
                  className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100"
                >
                  Explore courses
                  <SiViaplay />
                </button>

                <button
                  onClick={() => navigate("/searchwithai")}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20"
                >
                  Search with AI

                  <img
                    src={ai}
                    alt=""
                    className="hidden h-7 w-7 rounded-full lg:block"
                  />

                  <img
                    src={ai1}
                    alt=""
                    className="h-7 w-7 rounded-full lg:hidden"
                  />

                </button>

              </div>

            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">

              {[
                {
                  title: "100+ guided paths",
                  subtitle: "From beginner to advanced",
                },
                {
                  title: "Live AI search",
                  subtitle: "Find what you need in seconds",
                },
                {
                  title: "Creator tools",
                  subtitle: "Publish and manage your own courses",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-300">
                    {item.subtitle}
                  </p>
                </div>
              ))}

            </div>

          </div>

        </section>

        {/* Why Section */}

        <div className="mx-auto max-w-7xl px-6 py-8">

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                  Why learners love it
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Everything you need to move from curiosity to mastery.
                </h2>
              </div>

              <div className="rounded-full bg-slate-900 px-5 py-2 text-white">
                Trusted by students and educators
              </div>

            </div>

          </div>

        </div>

        <Logos />

        <ExploreCourses />

        <Cardspage />

        <About />

        <ReviewPage />

        <Footer />

      </div>
    </>
  );
}

export default Home;