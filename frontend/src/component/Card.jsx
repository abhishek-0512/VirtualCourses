import React from "react";
import { useNavigate } from "react-router-dom";
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
      className="w-[320px] bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <img
        src={thumbnail || img}
        alt={title}
        className="w-full h-[190px] object-cover"
      />

      <div className="p-4">
        <h2 className="text-lg font-bold line-clamp-2">
          {title}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {category}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-green-600">
            ₹{price}
          </span>

          <span className="text-yellow-500 font-medium">
            ⭐ {averageRating}
          </span>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          {reviews.length} Reviews
        </p>
      </div>
    </div>
  );
}

export default Card;