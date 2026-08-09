import React from "react";
import { Star, CheckCircle, Quote } from "lucide-react";

const ReviewCard = ({ text, name, image, rating = 5, role = "Student" }) => {
  const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    name || "Learner"
  )}`;

  return (
    <div className="group relative flex flex-col justify-between p-6 rounded-3xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/40 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-indigo-500/10">
      <div>
        {/* Rating Stars & Quote Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < (rating || 5)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-700"
                }`}
              />
            ))}
            <span className="text-xs font-bold text-slate-300 ml-1.5">
              {(rating || 5).toFixed(1)}
            </span>
          </div>
          <Quote className="w-5 h-5 text-indigo-500/30 group-hover:text-indigo-400/60 transition-colors" />
        </div>

        {/* Review Body */}
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
          "{text || "Great course content! Learned so much from the structured lectures and AI tutor assistance."}"
        </p>
      </div>

      {/* Reviewer Info */}
      <div className="flex items-center gap-3.5 pt-4 border-t border-slate-800/60">
        <img
          src={image || defaultAvatar}
          alt={name || "Reviewer"}
          className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/40 shadow-md"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultAvatar;
          }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="font-bold text-white text-xs truncate">
              {name || "Anonymous Learner"}
            </h4>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" title="Verified Learner" />
          </div>
          <p className="text-[11px] text-slate-400 capitalize truncate">
            {role || "Verified Student"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
