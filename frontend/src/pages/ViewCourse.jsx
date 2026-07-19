import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { FaArrowLeftLong } from "react-icons/fa6";
import img from "../assets/empty.jpg";
import Card from "../component/Card.jsx";
import { setSelectedCourseData } from "../redux/courseSlice";
import { FaLock, FaPlayCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa6";


function ViewCourse() {

  const { courseId } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();


  const { courseData, selectedCourseData } = useSelector(
    state => state.course
  );

  const { userData } = useSelector(
    state => state.user
  );


  const [creatorData, setCreatorData] = useState(null);

  const [selectedLecture, setSelectedLecture] = useState(null);

  const [selectedCreatorCourse, setSelectedCreatorCourse] = useState([]);

  const [isEnrolled, setIsEnrolled] = useState(false);

  const [rating, setRating] = useState(0);

  const [comment, setComment] = useState("");



  // ---------------- Average Rating ----------------

  const calculateAverageRating = (reviews) => {

    if (!reviews || reviews.length === 0) {
      return 0;
    }

    const total = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    return (total / reviews.length).toFixed(1);

  };


  const avgRating = calculateAverageRating(
    selectedCourseData?.reviews
  );



  // ---------------- Fetch Course ----------------

  const fetchCourseData = () => {

    const course = courseData.find(
      item => item._id === courseId
    );


    if(course){

      dispatch(
        setSelectedCourseData(course)
      );

    }

  };




  // ---------------- Check Enrollment ----------------

  const checkEnrollment = () => {


    const verify = userData?.enrolledCourses?.some(
      (course)=>{

        const enrolledId =
          typeof course === "string"
          ? course
          : course._id;


        return enrolledId?.toString() === courseId?.toString();

      }
    );


    console.log(
      "Enrollment verified:",
      verify
    );


    setIsEnrolled(!!verify);

  };




  useEffect(()=>{

    fetchCourseData();

    checkEnrollment();

  },[
    courseId,
    courseData,
    userData
  ]);





  // ---------------- Fetch Creator ----------------

  useEffect(()=>{


    const getCreator = async()=>{

      try{

        if(selectedCourseData?.creator){


          const result = await axios.post(

            serverUrl + "/api/course/getcreator",

            {
              userId:selectedCourseData.creator
            },

            {
              withCredentials:true
            }

          );


          setCreatorData(result.data);

        }


      }
      catch(error){

        console.log(
          "Creator Error:",
          error
        );

      }

    };


    getCreator();


  },[
    selectedCourseData
  ]);






  // ---------------- Other Courses ----------------


  useEffect(()=>{


    if(
      creatorData?._id &&
      courseData.length>0
    ){

      const courses =
        courseData.filter(
          course =>
            course.creator === creatorData._id &&
            course._id !== courseId
        );


      setSelectedCreatorCourse(courses);

    }


  },[
    creatorData,
    courseData
  ]);





  // ---------------- Add Review ----------------


  const handleReview = async()=>{


    try{


      const result = await axios.post(

        serverUrl + "/api/review/givereview",

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
        "Review Added"
      );


      setRating(0);

      setComment("");


      console.log(result.data);


    }
    catch(error){

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Review failed"
      );

    }


  };





  // ---------------- Razorpay Enrollment ----------------


  const handleEnroll = async()=>{


    try{


      if(!window.Razorpay){

        toast.error(
          "Razorpay SDK not loaded"
        );

        return;

      }




      const orderData = await axios.post(

        serverUrl + "/api/payment/create-order",

        {
          courseId
        },

        {
          withCredentials:true
        }

      );



      const order = orderData.data;



      const options = {


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



        handler:
        async function(response){


          try{


            const verify =
            await axios.post(

              serverUrl + "/api/payment/verify-payment",

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


            setIsEnrolled(true);


            toast.success(
              verify.data.message
            );


          }
          catch(error){


            console.log(
              error
            );


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


      console.log(
        "Enroll Error:",
        error
      );


      toast.error(

        error.response?.data?.message ||
        "Something went wrong while enrolling"

      );


    }


  };
    return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">


        {/* TOP SECTION */}

        <div className="flex flex-col md:flex-row gap-6">


          {/* Thumbnail */}

          <div className="w-full md:w-1/2">


            <FaArrowLeftLong
              className="text-black w-[22px] h-[22px] cursor-pointer mb-3"
              onClick={()=>navigate("/")}
            />


            <img
              src={
                selectedCourseData?.thumbnail ||
                img
              }
              alt="Course Thumbnail"
              className="rounded-xl w-full object-cover"
            />


          </div>




          {/* Course Details */}


          <div className="flex-1 space-y-3 mt-5">


            <h1 className="text-2xl font-bold">
              {selectedCourseData?.title}
            </h1>


            <p className="text-gray-600">
              {selectedCourseData?.subTitle}
            </p>



            <div className="flex flex-col gap-2">


              <div className="text-yellow-500 font-medium">

                ⭐ {avgRating}

                <span className="text-gray-500 ml-2">
                  ({selectedCourseData?.reviews?.length || 0} reviews)
                </span>

              </div>



              <div>

                <span className="text-lg font-semibold">

                  ₹{selectedCourseData?.price}

                </span>


                <span className="line-through text-gray-400 ml-2">

                  ₹599

                </span>

              </div>


            </div>




            <ul className="text-sm text-gray-700 space-y-1">

              <li>
                ✅ 10+ hours of video content
              </li>

              <li>
                ✅ Lifetime access
              </li>


            </ul>





            {!isEnrolled ? (

              <button

                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-700"

                onClick={handleEnroll}

              >

                Enroll Now

              </button>


            ):(


              <button

                className="bg-green-200 text-green-700 px-6 py-2 rounded"

                onClick={()=>
                  navigate(`/viewlecture/${courseId}`)
                }

              >

                Watch Now

              </button>


            )}



          </div>


        </div>





        {/* LEARNING */}

        <div>

          <h2 className="text-xl font-semibold mb-2">
            What You'll Learn
          </h2>


          <ul className="list-disc pl-6 text-gray-700">

            <li>
              Learn {selectedCourseData?.category} from beginning
            </li>

          </ul>


        </div>






        {/* CURRICULUM */}


        <div className="flex flex-col md:flex-row gap-6">


          <div className="bg-white w-full md:w-2/5 p-6 rounded-xl shadow border">


            <h2 className="text-xl font-bold">

              Course Curriculum

            </h2>


            <p className="text-sm text-gray-500 mb-4">

              {selectedCourseData?.lectures?.length || 0}
              {" "}
              Lectures

            </p>




            {
              selectedCourseData?.lectures?.map(
                (lecture,index)=>(


                <button

                  key={index}

                  disabled={!lecture.isPreviewFree}

                  onClick={()=>
                    lecture.isPreviewFree &&
                    setSelectedLecture(lecture)
                  }

                  className="flex items-center gap-3 w-full p-3 border rounded-lg mb-2"

                >

                  {
                    lecture.isPreviewFree
                    ?
                    <FaPlayCircle/>
                    :
                    <FaLock/>
                  }


                  {lecture.lectureTitle}


                </button>


                )
              )
            }



          </div>





          <div className="bg-black w-full md:w-3/5 rounded-xl flex items-center justify-center">


            {

              selectedLecture?.videoUrl ?

              <video

                src={selectedLecture.videoUrl}

                controls

                className="w-full h-full rounded-xl"

              />

              :

              <span className="text-white">

                Select preview lecture

              </span>

            }



          </div>



        </div>








        {/* REVIEW */}


        <div className="border-t pt-6">


          <h2 className="text-xl font-semibold mb-3">

            Write a Review

          </h2>



          <div className="flex gap-2 mb-3">


            {
              [1,2,3,4,5].map(
                star=>(

                <FaStar

                  key={star}

                  onClick={()=>
                    setRating(star)
                  }

                  className={
                    star <= rating
                    ?
                    "fill-yellow-500 cursor-pointer"
                    :
                    "fill-gray-300 cursor-pointer"
                  }

                />


                )
              )
            }


          </div>




          <textarea

            value={comment}

            onChange={
              e=>setComment(e.target.value)
            }

            rows="3"

            className="w-full border p-2 rounded"

            placeholder="Write your review"

          />



          <button

            onClick={handleReview}

            className="bg-black text-white px-4 py-2 mt-3 rounded"

          >

            Submit Review

          </button>



        </div>







        {/* CREATOR */}


        <div className="border-t pt-5 flex gap-4 items-center">


          <img

            src={
              creatorData?.photoUrl ||
              img
            }

            className="w-16 h-16 rounded-full object-cover"

          />



          <div>


            <h3 className="font-semibold text-lg">

              {creatorData?.name}

            </h3>


            <p className="text-gray-600">

              {creatorData?.description}

            </p>


            <p className="text-gray-600 text-sm">

              {creatorData?.email}

            </p>


          </div>


        </div>








        {/* OTHER COURSES */}


        <div>


          <h2 className="text-xl font-semibold mb-4">

            Other Published Courses by the Educator

          </h2>



          <div className="flex flex-wrap gap-6">


            {
              selectedCreatorCourse.map(
                (item,index)=>(

                <Card

                  key={index}

                  thumbnail={
                    item.thumbnail || img
                  }

                  title={item.title}

                  id={item._id}

                  price={item.price}

                  category={item.category}

                  reviews={item.reviews}

                />


                )
              )
            }


          </div>



        </div>



      </div>


    </div>
  );

}

export default ViewCourse;