import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, BookOpen, ChevronRight, Bookmark, Sparkles, Layers } from "lucide-react";
import img from "../assets/empty.jpg";
import { toast } from "react-toastify";

function Card({
  id,
  thumbnail,
  title,
  price,
  category,
  level = "Beginner",
  lectures = [],
  reviews = [],
}) {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Check if course is bookmarked in localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("vc_bookmarks") || "[]");
      setIsBookmarked(saved.some((item) => (item._id || item.id || item) === id));
    } catch (e) {
      setIsBookmarked(false);
    }
  }, [id]);

  const toggleBookmark = (e) => {
    e.stopPropagation();
    try {
      const saved = JSON.parse(localStorage.getItem("vc_bookmarks") || "[]");
      const exists = saved.some((item) => (item._id || item.id || item) === id);

      let updated;
      if (exists) {
        updated = saved.filter((item) => (item._id || item.id || item) !== id);
        toast.info("Removed from saved bookmarks");
      } else {
        updated = [...saved, { _id: id, id, title, thumbnail, price, category, level, reviews }];
        toast.success("Saved to your bookmarks!");
      }

      localStorage.setItem("vc_bookmarks", JSON.stringify(updated));
      setIsBookmarked(!exists);
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error(err);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "5.0";

  return (
    <div
      onClick={() => navigate(`/viewcourse/${id}`)}
      className="group relative flex flex-col w-full bg-slate-900/70 border border-slate-800/90 rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-indigo-500/15 hover:border-indigo-500/50 hover:-translate-y-2 transition-all duration-300 backdrop-blur-xl"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
        <img
          src={thumbnail || img}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {category ? (
            <span className="bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-indigo-300 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
              {category}
            </span>
          ) : <span />}

          {/* Bookmark Button (interactive) */}
          <button
            onClick={toggleBookmark}
            className="pointer-events-auto p-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-amber-400 hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer"
            title={isBookmarked ? "Remove Bookmark" : "Save Course"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
          </button>
        </div>

        {/* Level Tag on bottom of thumbnail */}
        <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[10px] font-semibold text-slate-300 bg-slate-950/70 backdrop-blur-sm px-2 py-0.5 rounded-md border border-slate-800">
          <Layers className="w-3 h-3 text-indigo-400" />
          <span>{level || "All Levels"}</span>
        </div>
      </div>

      {/* Card Details */}
      <div className="flex flex-col flex-1 p-5 justify-between">
        <div>
          {/* Course Title */}
          <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
            {title}
          </h3>

          {/* Rating & Details Row */}
          <div className="flex items-center justify-between mt-3 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <span className="text-xs font-bold text-white">
                {averageRating}
              </span>
              <span className="text-[11px] text-slate-400">
                ({reviews.length || 12} reviews)
              </span>
            </div>

            {Array.isArray(lectures) && lectures.length > 0 && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-indigo-400" />
                {lectures.length} lessons
              </span>
            )}
          </div>
        </div>

        {/* Footer: Price & CTA */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between mt-auto">
          <div>
            {price > 0 ? (
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-black text-white">
                  ₹{price}
                </span>
                <span className="text-[10px] text-slate-400 line-through">
                  ₹{Math.round(price * 1.5)}
                </span>
              </div>
            ) : (
              <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
                FREE
              </span>
            )}
          </div>

          <div className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all">
            <span>Explore</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;