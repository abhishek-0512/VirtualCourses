import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { 
  GraduationCap, 
  Sparkles, 
  Send, 
  Check, 
  Globe, 
  ShieldCheck,
  Heart
} from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";
import { toast } from "react-toastify";

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubscribed(true);
    toast.success("Thank you for subscribing to our learning newsletter!");
    setEmail("");
  };

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-slate-400 font-sans relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-indigo-600/5 blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand & Newsletter (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div 
              className="flex items-center gap-3 cursor-pointer group w-fit"
              onClick={() => navigate("/")}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-600/20 text-indigo-400">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <span className="text-base font-black text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                  VirtualCourses
                </span>
                <span className="ml-1.5 rounded-md bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/30">
                  AI
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering global learners and creators with AI-powered personalized tutoring, interactive video curriculums, and verifiable credentials.
            </p>

            {/* Newsletter Subscription Box */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Join our Weekly Knowledge Digest
              </p>
              <form onSubmit={handleSubscribe} className="flex max-w-sm items-center rounded-2xl border border-slate-800 bg-slate-900/80 p-1 focus-within:border-indigo-500/60 transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
                >
                  {subscribed ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{subscribed ? "Subscribed" : "Join"}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform
            </h3>
            <ul className="space-y-2 text-xs">
              <li 
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate("/allcourses")}
              >
                All Courses
              </li>
              <li 
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate("/searchwithai")}
              >
                Search with AI
              </li>
              <li 
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate("/enrolledcourses")}
              >
                My Enrolled Courses
              </li>
              <li 
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate("/profile")}
              >
                Student Profile
              </li>
              <li 
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate("/dashboard")}
              >
                Creator Studio
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Categories (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Popular Tracks
            </h3>
            <ul className="space-y-2 text-xs">
              <li 
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate("/allcourses?category=Web%20Development")}
              >
                Web Development & React
              </li>
              <li 
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate("/allcourses?category=AI%20%26%20Machine%20Learning")}
              >
                AI & Machine Learning
              </li>
              <li 
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate("/allcourses?category=Data%20Science")}
              >
                Data Science & Analytics
              </li>
              <li 
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate("/allcourses?category=UI%2FUX%20Design")}
              >
                UI/UX Design Systems
              </li>
              <li 
                className="cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate("/allcourses?category=Cybersecurity")}
              >
                Cybersecurity & Ethical Hacking
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Status (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Security & Status
            </h3>
            
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>System 100% Online</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Razorpay SSL 256-bit Encrypted Checkout
              </p>
            </div>

            <div className="flex items-center gap-3 text-slate-400">
              <span className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-white hover:border-indigo-500/40 cursor-pointer transition-colors">
                <FaGithub className="w-4 h-4" />
              </span>
              <span className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-white hover:border-indigo-500/40 cursor-pointer transition-colors">
                <FaTwitter className="w-4 h-4" />
              </span>
              <span className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-white hover:border-indigo-500/40 cursor-pointer transition-colors">
                <FaLinkedin className="w-4 h-4" />
              </span>
              <span className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-white hover:border-indigo-500/40 cursor-pointer transition-colors">
                <FaYoutube className="w-4 h-4" />
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Virtual Courses Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
