import React from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ thumbnail, title, category, price, id, reviews }) => {

  const navigate = useNavigate();


  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;

    const total = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    return (total / reviews.length).toFixed(1);
  };


  const avgRating = calculateAverageRating(reviews);


  return (
    <div
      className="max-w-sm w-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-300 cursor-pointer"
      onClick={() => navigate(`/viewcourse/${id}`)}
    >


      {/* Thumbnail */}
      <div className="w-full h-52 bg-gray-100 overflow-hidden flex items-center justify-center">

        <img
          src={thumbnail || "/default-course.png"}
          alt={title || "Course thumbnail"}
          className="w-full h-full object-contain"
        />

      </div>



      {/* Content */}
      <div className="p-5 space-y-2">


        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900">
          {title}
        </h2>



        {/* Category */}
        <span className="px-2 py-0.5 bg-gray-100 rounded-full text-gray-700 capitalize">
          {category}
        </span>



        {/* Meta info */}
        <div className="flex justify-between text-sm text-gray-600 mt-3 px-[10px]">


          <span className="font-semibold text-gray-800">
            ₹{price}
          </span>


          <span className="flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            {avgRating}
          </span>


        </div>


      </div>


    </div>
  );
};


export default CourseCard;