import React from "react";
import about from "../assets/about.jpg";
import VideoPlayer from "./VideoPlayer";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { BiSolidBadgeCheck } from "react-icons/bi";

function About() {
  return (
    <section className="w-full bg-white py-24 overflow-visible">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-16 px-6">

        {/* Left Side */}
        <div className="relative lg:w-[42%] w-full flex justify-center pb-32">

          <img
            src={about}
            alt="About"
            className="w-full max-w-[520px] rounded-3xl shadow-2xl object-cover"
          />

          <VideoPlayer />

        </div>

        {/* Right Side */}
        <div className="lg:w-[48%] w-full">

          <div className="flex items-center gap-4 text-lg font-semibold text-blue-600">
            About Us
            <TfiLayoutLineSolid className="text-black" />
          </div>

          <h2 className="mt-5 text-4xl md:text-5xl font-bold leading-tight text-slate-900">
            We Are Maximize Your Learning Growth
          </h2>

          <p className="mt-6 text-gray-600 leading-8">
            We provide a modern Learning Management System to simplify online
            education, track progress, and enhance student-instructor
            collaboration efficiently.
          </p>

          <div className="grid grid-cols-2 gap-y-6 gap-x-8 mt-10">

            <div className="flex items-center gap-3">
              <BiSolidBadgeCheck className="text-green-600 text-xl" />
              <span>Simplified Learning</span>
            </div>

            <div className="flex items-center gap-3">
              <BiSolidBadgeCheck className="text-green-600 text-xl" />
              <span>Expert Trainers</span>
            </div>

            <div className="flex items-center gap-3">
              <BiSolidBadgeCheck className="text-green-600 text-xl" />
              <span>Big Experience</span>
            </div>

            <div className="flex items-center gap-3">
              <BiSolidBadgeCheck className="text-green-600 text-xl" />
              <span>Lifetime Access</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default About;