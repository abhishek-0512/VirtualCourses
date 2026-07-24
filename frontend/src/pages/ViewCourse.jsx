import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { setSelectedCourseData } from "../redux/courseSlice";
import { toast } from "react-toastify";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaLock, FaPlayCircle, FaStar } from "react-icons/fa";
import Card from "../component/Card.jsx";
import img from "../assets/empty.jpg";


function ViewCourse() {

  const { courseId } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();


  const {
    courseData = [],
    selectedCourseData
  } = useSelector(
    (state) => state.course
  );


  const { userData } = useSelector(
    (state) => state.user
  );


  const [creatorData,setCreatorData] =
    useState(null);


  const [selectedLecture,setSelectedLecture] =
    useState(null);


  const [selectedCreatorCourse,setSelectedCreatorCourse] =
    useState([]);


  const [isEnrolled,setIsEnrolled] =
    useState(false);


  const [rating,setRating] =
    useState(0);


  const [comment,setComment] =
    useState("");



  // ===============================
  // Average Rating
  // ===============================

  const calculateAverageRating = (reviews)=>{

    if(!reviews || reviews.length===0)
      return 0;


    const total = reviews.reduce(
      (sum,item)=>sum + item.rating,
      0
    );


    return (total/reviews.length).toFixed(1);

  };


  const avgRating =
    calculateAverageRating(
      selectedCourseData?.reviews
    );



  // ===============================
  // Fetch Course
  // ===============================

  const fetchCourseData = async()=>{

    try{

      const course =
        courseData.find(
          item=>item._id===courseId
        );


      if(course){

        dispatch(
          setSelectedCourseData(course)
        );

        return;
      }



      const {data}=await axios.get(
        `${serverUrl}/api/course/${courseId}`,
        {
          withCredentials:true
        }
      );



      if(data.success){

        dispatch(
          setSelectedCourseData(
            data.course
          )
        );

      }


    }
    catch(error){

      console.log(
        "Course fetch error:",
        error
      );


      toast.error(
        "Course not found"
      );

    }

  };



  // ===============================
  // Enrollment Check
  // ===============================

  const checkEnrollment = ()=>{


    const verify =
      userData?.enrolledCourses?.some(
        (course)=>{


          const id =
            typeof course==="string"
            ? course
            : course._id;



          return (
            id?.toString() ===
            courseId?.toString()
          );

        }
      );


    setIsEnrolled(
      verify || false
    );

  };




  useEffect(()=>{

    fetchCourseData();

  },[
    courseId,
    courseData
  ]);




  useEffect(()=>{

    checkEnrollment();

  },[
    userData
  ]);



  // ===============================
  // Creator Data
  // ===============================

  useEffect(()=>{


    const getCreator = async()=>{

      try{

        if(!selectedCourseData?.creator)
          return;



        const creatorId =
          typeof selectedCourseData.creator==="object"
          ?
          selectedCourseData.creator._id
          :
          selectedCourseData.creator;



        const {data}=await axios.get(

          `${serverUrl}/api/course/creator/${creatorId}`,

          {
            withCredentials:true
          }

        );



        if(data.success){

          setCreatorData(
            data.creator
          );

        }


      }
      catch(error){

        console.log(error);

      }

    };



    getCreator();


  },[
    selectedCourseData
  ]);



  // ===============================
  // Other Courses
  // ===============================

  useEffect(()=>{


    if(!creatorData)
      return;



    const courses =
      courseData.filter(
        course=>{


          const creatorId =
            typeof course.creator==="object"
            ?
            course.creator._id
            :
            course.creator;



          return (
            creatorId===creatorData._id &&
            course._id!==courseId
          );


        }
      );



    setSelectedCreatorCourse(
      courses
    );


  },[
    creatorData,
    courseData
  ]);



  // ===============================
  // Review
  // ===============================

  const handleReview = async()=>{

    try{

      const {data}=await axios.post(

        `${serverUrl}/api/review/givereview`,

        {
          rating,
          comment,
          courseId
        },

        {
          withCredentials:true
        }

      );


      toast.success(
        data.message
      );


      setRating(0);

      setComment("");

      fetchCourseData();


    }
    catch(error){

      toast.error(
        error.response?.data?.message ||
        "Review failed"
      );

    }

  };



  // ===============================
  // Enrollment
  // ===============================

  const handleEnroll = async()=>{

    try{


      const {data:order}=await axios.post(

        `${serverUrl}/api/payment/create-order`,

        {
          courseId
        },

        {
          withCredentials:true
        }

      );



      const options={

        key:
        import.meta.env.VITE_RAZORPAY_KEY_ID,


        amount:
        order.amount,


        currency:
        order.currency,


        name:
        "Virtual Courses",


        description:
        selectedCourseData.title,


        order_id:
        order.id,


        handler:async(response)=>{


          try{


            const {data}=await axios.post(

              `${serverUrl}/api/payment/verify-payment`,

              {

                razorpay_order_id:
                response.razorpay_order_id,


                razorpay_payment_id:
                response.razorpay_payment_id,


                razorpay_signature:
                response.razorpay_signature,


                courseId,


                userId:userData._id

              },

              {
                withCredentials:true
              }

            );


            toast.success(
              data.message
            );


            setIsEnrolled(true);


          }
          catch(error){

            toast.error(
              "Payment verification failed"
            );

          }

        },


        prefill:{

          name:userData?.name,

          email:userData?.email

        },


        theme:{
          color:"#000000"
        }

      };



      const razorpay =
        new window.Razorpay(options);


      razorpay.open();


    }
    catch(error){

      toast.error(
        "Enrollment failed"
      );

    }

  };
    if (!selectedCourseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold">
          Loading Course...
        </h1>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">

        {/* Top Section */}

        <div className="flex flex-col md:flex-row gap-6">

          <div className="w-full md:w-1/2">

            <FaArrowLeftLong
              className="cursor-pointer mb-4 text-xl"
              onClick={()=>navigate("/")}
            />


            <img
              src={
                selectedCourseData.thumbnail || img
              }
              alt="thumbnail"
              className="w-full rounded-xl object-cover"
            />

          </div>


          <div className="flex-1">

            <h1 className="text-3xl font-bold">
              {selectedCourseData.title}
            </h1>


            <p className="text-gray-600 mt-3">
              {selectedCourseData.subTitle}
            </p>


            <div className="mt-4 text-yellow-500 flex items-center gap-2">

              <FaStar/>

              {avgRating}

              <span className="text-gray-500">
                ({selectedCourseData.reviews?.length || 0} Reviews)
              </span>

            </div>


            <h2 className="text-2xl font-bold mt-4">
              ₹{selectedCourseData.price}
            </h2>



            {
              !isEnrolled ?

              <button
                onClick={handleEnroll}
                className="mt-5 bg-black text-white px-6 py-3 rounded-lg"
              >
                Enroll Now
              </button>

              :

              <button
                onClick={()=>navigate(`/viewlecture/${courseId}`)}
                className="mt-5 bg-green-600 text-white px-6 py-3 rounded-lg"
              >
                Watch Course
              </button>
            }


          </div>

        </div>




        {/* Curriculum */}

        <div className="mt-10">

          <h2 className="text-2xl font-bold mb-4">
            Course Curriculum
          </h2>


          {
            selectedCourseData.lectures?.map(
              (lecture,index)=>(

                <button

                  key={lecture._id}

                  onClick={()=>
                    lecture.isPreviewFree &&
                    setSelectedLecture(lecture)
                  }


                  className="w-full flex items-center gap-3 border p-3 rounded-lg mb-3"

                >

                  {
                    lecture.isPreviewFree
                    ?
                    <FaPlayCircle/>
                    :
                    <FaLock/>
                  }


                  {index+1}. {lecture.lectureTitle}


                </button>

              )
            )
          }

        </div>





        {/* Video Preview */}

        <div className="mt-6 bg-black rounded-xl min-h-[300px] flex items-center justify-center">

          {
            selectedLecture ?

            <video
              src={selectedLecture.videoUrl}
              controls
              className="w-full rounded-xl"
            />

            :

            <p className="text-white">
              Select Preview Lecture
            </p>

          }

        </div>






        {/* Review */}

        <div className="mt-10 border-t pt-6">

          <h2 className="text-xl font-bold">
            Give Review
          </h2>


          <div className="flex gap-2 mt-3">

            {
              [1,2,3,4,5].map(
                star=>(

                  <FaStar

                    key={star}

                    onClick={()=>setRating(star)}

                    className={
                      star<=rating
                      ?
                      "text-yellow-500 cursor-pointer"
                      :
                      "text-gray-300 cursor-pointer"
                    }

                  />

                )
              )
            }

          </div>


          <textarea

            value={comment}

            onChange={(e)=>setComment(e.target.value)}

            className="border w-full mt-4 p-3 rounded"

            placeholder="Write review"

          />


          <button

            onClick={handleReview}

            className="bg-black text-white px-5 py-2 rounded mt-3"

          >

            Submit

          </button>


        </div>






        {/* Creator */}

        <div className="mt-10 border-t pt-6 flex gap-4">

          <img
            src={creatorData?.photoUrl || img}
            className="w-16 h-16 rounded-full"
          />


          <div>

            <h2 className="font-bold">
              {creatorData?.name}
            </h2>


            <p>
              {creatorData?.description}
            </p>


          </div>


        </div>







        {/* Other Courses */}

        <div className="mt-10">

          <h2 className="text-xl font-bold mb-4">
            Other Courses
          </h2>


          <div className="flex flex-wrap gap-6">

            {
              selectedCreatorCourse.map(course=>(

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
            }

          </div>

        </div>


      </div>

    </div>
  );

}

export default ViewCourse;
