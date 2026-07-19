import React, { useMemo, useState } from "react";
import Card from "../component/Card.jsx";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Nav from "../component/Nav";
import ai from "../assets/SearchAi.png";
import { useSelector } from "react-redux";

function AllCourses() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [category, setCategory] = useState([]);

  const navigate = useNavigate();

  const { courseData } = useSelector((state) => state.course);


  // Get categories dynamically from courses

  const categories = useMemo(() => {
    if (!courseData) return [];

    return [
      ...new Set(
        courseData.map((course) => course.category)
      ),
    ];
  }, [courseData]);


  // Handle checkbox

  const toggleCategory = (e) => {
    const value = e.target.value;

    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };


  // Filter courses

  const filteredCourses = useMemo(() => {

    if (!courseData) return [];

    if (category.length === 0) {
      return courseData;
    }

    return courseData.filter((course) =>
      category.includes(course.category)
    );

  }, [category, courseData]);



  return (
    <div className="flex min-h-screen bg-gray-50 pt-20 lg:pt-24">

      <Nav />


      {/* Mobile Filter Button */}

      <button
        onClick={() => setIsSidebarVisible((prev) => !prev)}
        className="fixed top-20 left-4 z-50 bg-white text-black px-3 py-1 rounded-md md:hidden border-2 border-black"
      >
        {isSidebarVisible ? "Hide" : "Show"} Filters
      </button>



      {/* Sidebar */}

      <aside
        className={`w-[260px] h-screen overflow-y-auto bg-black fixed top-0 left-0 p-6 pt-[130px] shadow-md transition-transform duration-300 z-20

        ${
          isSidebarVisible
            ? "translate-x-0"
            : "-translate-x-full"
        }

        md:translate-x-0`}
      >


        <h2 className="text-xl font-bold flex items-center justify-center gap-2 text-white mb-6">

          <FaArrowLeftLong
            className="cursor-pointer"
            onClick={() => navigate("/")}
          />

          Filter by Category

        </h2>



        <div className="space-y-4 bg-gray-600 text-white border p-5 rounded-2xl">


          <button
            onClick={() => navigate("/searchwithai")}
            className="px-4 py-2 bg-black text-white rounded-lg flex items-center gap-2 cursor-pointer"
          >

            Search with AI

            <img
              src={ai}
              alt="AI"
              className="w-[30px] h-[30px] rounded-full"
            />

          </button>



          {
            categories.map((item)=>(

              <label
                key={item}
                className="flex items-center gap-3 cursor-pointer hover:text-gray-200"
              >

                <input
                  type="checkbox"
                  value={item}
                  checked={category.includes(item)}
                  onChange={toggleCategory}
                  className="w-4 h-4 accent-black"
                />

                {item}

              </label>

            ))
          }


        </div>


      </aside>




      {/* Courses Section */}

      <main
        className="w-full py-[130px] md:pl-[300px] flex flex-wrap justify-center md:justify-start gap-6 px-4"
      >


        {
          filteredCourses.length > 0 ?

          filteredCourses.map((course)=>(

            <Card

              key={course._id}

              thumbnail={course.thumbnail}

              title={course.title}

              price={course.price}

              category={course.category}

              id={course._id}

              reviews={course.reviews}

            />

          ))

          :

          (

            <div className="w-full text-center text-2xl font-semibold mt-20">
              No Courses Found
            </div>

          )

        }


      </main>



    </div>
  );
}

export default AllCourses;