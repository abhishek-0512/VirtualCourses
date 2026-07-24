import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlayCircle } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";

import { serverUrl } from "../App";
import { setLectureData } from "../redux/lectureSlice";


function ViewLecture() {

  const { courseId } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();


  const { courseData } = useSelector(
    (state) => state.course
  );

  const { lectureData } = useSelector(
    (state) => state.lecture
  );


  const { userData } = useSelector(
    (state) => state.user
  );


  const selectedCourse = courseData?.find(
    (course) => course._id === courseId
  );


  const [selectedLecture, setSelectedLecture] = useState(null);



  // GET COURSE LECTURES

  useEffect(() => {


    const getLectures = async () => {

      try {


        const { data } = await axios.get(

          `${serverUrl}/api/lecture/course/${courseId}`,

          {
            withCredentials: true,
          }

        );


        dispatch(
          setLectureData(data.lectures)
        );


      } catch (error) {

        console.log(error);

      }

    };


    if(courseId){

      getLectures();

    }


  }, [courseId, dispatch]);




  // SET FIRST LECTURE

  useEffect(() => {

    if(lectureData?.length > 0){

      setSelectedLecture(
        lectureData[0]
      );

    }

  }, [lectureData]);




  const courseCreator =
    userData?._id === selectedCourse?.creator
    ?
    userData
    :
    null;



  return (

    <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6">


      {/* Left - Video */}

      <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200">


        <div className="mb-6">


          <h1 className="text-2xl font-bold flex items-center gap-[20px] text-gray-800">

            <FaArrowLeftLong
              className="text-black w-[22px] h-[22px] cursor-pointer"
              onClick={() => navigate("/")}
            />


            {selectedCourse?.title}


          </h1>



          <div className="mt-2 flex gap-4 text-sm text-gray-500 font-medium">

            <span>
              Category: {selectedCourse?.category}
            </span>


            <span>
              Level: {selectedCourse?.level}
            </span>


          </div>


        </div>





        {/* Video Player */}

        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 border border-gray-300">


          {
            selectedLecture?.videoUrl ?

            (

              <video

                src={selectedLecture.videoUrl}

                controls

                className="w-full h-full object-cover"

              />

            )

            :

            (

              <div className="flex items-center justify-center h-full text-white">

                Select a lecture to start watching

              </div>

            )

          }


        </div>





        {/* Lecture Info */}

        <div className="mt-2">

          <h2 className="text-lg font-semibold text-gray-800">

            {selectedLecture?.lectureTitle}

          </h2>


        </div>



      </div>






      {/* Right Side */}


      <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200 h-fit">


        <h2 className="text-xl font-bold mb-4 text-gray-800">

          All Lectures

        </h2>




        <div className="flex flex-col gap-3 mb-6">


          {
            lectureData?.length > 0 ?

            (

              lectureData.map((lecture,index)=>(


                <button

                  key={lecture._id}

                  onClick={() =>
                    setSelectedLecture(lecture)
                  }


                  className={

                    `flex items-center justify-between p-3 rounded-lg border transition text-left 

                    ${
                      selectedLecture?._id === lecture._id

                      ?

                      "bg-gray-200 border-gray-500"

                      :

                      "hover:bg-gray-50 border-gray-300"

                    }`

                  }

                >


                  <div>


                    <h4 className="text-sm font-semibold text-gray-800">

                      Lecture {index+1}: {lecture.lectureTitle}

                    </h4>


                  </div>



                  <FaPlayCircle className="text-black text-xl"/>



                </button>


              ))

            )


            :

            (

              <p className="text-gray-500">

                No lectures available.

              </p>

            )


          }


        </div>







        {/* Instructor */}


        {
          courseCreator &&

          (

            <div className="mt-4 border-t pt-4">


              <h3 className="text-md font-semibold text-gray-700 mb-3">

                Instructor

              </h3>



              <div className="flex items-center gap-4">


                <img

                  src={
                    courseCreator.photoUrl ||
                    "/default-avatar.png"
                  }

                  alt="Instructor"

                  className="w-14 h-14 rounded-full object-cover border"

                />



                <div>


                  <h4 className="text-base font-medium text-gray-800">

                    {courseCreator.name}

                  </h4>



                  <p className="text-sm text-gray-600">

                    {
                      courseCreator.description ||
                      "No bio available."
                    }

                  </p>


                </div>


              </div>


            </div>

          )

        }


      </div>


    </div>

  );

}


export default ViewLecture;