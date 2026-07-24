import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SiViaplay } from "react-icons/si";
import Card from "./Card";

function Cardspage() {
  const navigate = useNavigate();

  const { courseData = [] } = useSelector((state) => state.course);

  const [popularCourses, setPopularCourses] = useState([]);

  useEffect(() => {
    if (Array.isArray(courseData)) {
      setPopularCourses(courseData.slice(0, 6));
    } else {
      setPopularCourses([]);
    }
  }, [courseData]);

  return (
    <div className="relative flex flex-col items-center px-4 py-10">
      {/* Heading */}
      <h1 className="text-3xl md:text-5xl font-bold text-center">
        Our Popular Courses
      </h1>

      <p className="max-w-3xl text-center text-gray-600 mt-6 mb-10">
        Explore top-rated courses designed to boost your skills, enhance
        careers, and unlock opportunities in tech, AI, business, and beyond.
      </p>

      {/* Course Cards */}
      <div className="w-full flex flex-wrap justify-center gap-8">
        {popularCourses.length > 0 ? (
          popularCourses.map((course) => (
            <Card
              key={course._id}
              id={course._id}
              thumbnail={course.thumbnail}
              title={course.title}
              price={course.price}
              category={course.category}
              reviews={course.reviews}
            />
          ))
        ) : (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-600">
              No Courses Available
            </h2>
          </div>
        )}
      </div>

      {/* View All Button */}
      <button
        onClick={() => navigate("/allcourses")}
        className="mt-12 flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
      >
        View All Courses
        <SiViaplay className="w-5 h-5" />
      </button>
    </div>
  );
}

export default Cardspage;