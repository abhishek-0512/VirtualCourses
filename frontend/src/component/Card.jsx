import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, BookOpen, ChevronRight } from "lucide-react";
import img from "../assets/empty.jpg";

function Card({
  id,
  thumbnail,
  title,
  price,
  category,
  reviews = [],
}) {
  const navigate = useNavigate();

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div
      onClick={() => navigate(`/viewcourse/${id}`)}
      className="group relative flex flex-col w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/40 hover:-translate-y-1.5 transition-all duration-300"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
        <img
          src={thumbnail || img}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay for subtle text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category Badge */}
        {category && (
          <span className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md border border-slate-700/60 text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {category}
          </span>
        )}
      </div>

      {/* Card Details */}
      <div className="flex flex-col flex-1 p-5">
        {/* Course Title */}
        <h3 className="text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
          {title}
        </h3>

        {/* Spacer to align footer at bottom */}
        <div className="mt-auto pt-4">
          
          {/* Rating & Review Count */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <span className="text-sm font-bold text-slate-200">
              {averageRating}
            </span>
            <span className="text-xs text-slate-400">
              ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800 my-3" />

          {/* Price & CTA */}
          <div className="flex items-center justify-between">
            <div>
              {price > 0 ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-extrabold text-white">
                    ₹{price}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider">
                  Free
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all">
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Card;