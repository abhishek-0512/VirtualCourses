import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-slate-200 bg-slate-950 px-6 py-14 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.7fr_0.7fr]">
        <div>
          <img src={logo} alt="Logo" className="mb-4 h-11 w-11 rounded-xl border border-white/10 object-cover" />
          <h2 className="text-xl font-semibold text-white">Virtual Courses</h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
            Learn smarter with beautifully structured courses, intelligent discovery, and a creator-friendly experience built for modern growth.
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="cursor-pointer transition hover:text-white" onClick={() => navigate("/")}>Home</li>
            <li className="cursor-pointer transition hover:text-white" onClick={() => navigate("/allcourses")}>Courses</li>
            <li className="cursor-pointer transition hover:text-white" onClick={() => navigate("/login")}>Login</li>
            <li className="cursor-pointer transition hover:text-white" onClick={() => navigate("/profile")}>My Profile</li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold text-white">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="transition hover:text-white">Web Development</li>
            <li className="transition hover:text-white">AI/ML</li>
            <li className="transition hover:text-white">Data Science</li>
            <li className="transition hover:text-white">UI/UX Design</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-5 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Virtual Courses. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
