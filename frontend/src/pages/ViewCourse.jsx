import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { setSelectedCourseData } from "../redux/courseSlice";
import { toast } from "react-toastify";
import { 
  ArrowLeft, 
  Star, 
  PlayCircle, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  User, 
  BookOpen,
  MessageSquare
} from "lucide-react";
import Card from "../component/Card.jsx";
import Nav from "../component/Nav";
import img from "../assets/empty.jpg";

function ViewCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { courseData = [], selectedCourseData } = useSelector(
    (state) => state.course
  );
  const { userData } = useSelector((state) => state.user);

  const [creatorData, setCreatorData] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [selectedCreatorCourse, setSelectedCreatorCourse] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  // ===============================
  // Average Rating Calculation
  // ===============================
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, item) => sum + item.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(selectedCourseData?.reviews);

  // ===============================
  // Fetch Course
  // ===============================
  const fetchCourseData = async () => {
    try {
      const course = courseData.find((item) => item._id === courseId);
      if (course) {
        dispatch(setSelectedCourseData(course));
        return;
      }

      const { data } = await axios.get(`${serverUrl}/api/course/${courseId}`, {
        withCredentials: true,
      });

      if (data.success) {
        dispatch(setSelectedCourseData(data.course));
      }
    } catch (error) {
      console.log("Course fetch error:", error);
      toast.error("Course not found");
    }
  };

  // ===============================
  // Enrollment Check
  // ===============================
  const checkEnrollment = () => {
    const verify = userData?.enrolledCourses?.some((course) => {
      const id = typeof course === "string" ? course : course._id;
      return id?.toString() === courseId?.toString();
    });
    setIsEnrolled(verify || false);
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId, courseData]);

  useEffect(() => {
    checkEnrollment();
  }, [userData]);

  // ===============================
  // Creator Data
  // ===============================
  useEffect(() => {
    const getCreator = async () => {
      try {
        if (!selectedCourseData?.creator) return;

        const creatorId =
          typeof selectedCourseData.creator === "object"
            ? selectedCourseData.creator._id
            : selectedCourseData.creator;

        const { data } = await axios.get(
          `${serverUrl}/api/course/creator/${creatorId}`,
          { withCredentials: true }
        );

        if (data.success) {
          setCreatorData(data.creator);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getCreator();
  }, [selectedCourseData]);

  // ===============================
  // Other Courses
  // ===============================
  useEffect(() => {
    if (!creatorData) return;

    const courses = courseData.filter((course) => {
      const creatorId =
        typeof course.creator === "object"
          ? course.creator._id
          : course.creator;

      return creatorId === creatorData._id && course._id !== courseId;
    });

    setSelectedCreatorCourse(courses);
  }, [creatorData, courseData]);

  // ===============================
  // Review Handler
  // ===============================
  const handleReview = async () => {
    if (!rating) {
      toast.error("Please select a star rating");
      return;
    }
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/review/givereview`,
        { rating, comment, courseId },
        { withCredentials: true }
      );

      toast.success(data.message || "Review submitted successfully");
      setRating(0);
      setComment("");
      fetchCourseData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Review failed");
    }
  };

  // ===============================
  // Enrollment / Payment Handler
  // ===============================
  const handleEnroll = async () => {
    try {
      const { data: order } = await axios.post(
        `${serverUrl}/api/payment/create-order`,
        { courseId },
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "EduVerse",
        description: selectedCourseData.title,
        order_id: order.id,
        handler: async (response) => {
          try {
            const { data } = await axios.post(
              `${serverUrl}/api/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId,
                userId: userData._id,
              },
              { withCredentials: true }
            );

            toast.success(data.message);
            setIsEnrolled(true);
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: userData?.name,
          email: userData?.email,
        },
        theme: {
          color: "#6366f1",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error("Enrollment failed");
    }
  };

  if (!selectedCourseData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-lg font-medium">Loading course details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Nav />

      <div className="max-w-7xl mx-auto pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/allcourses")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to All Courses</span>
        </button>

        {/* Hero Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Media & Title Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
              <img
                src={selectedCourseData.thumbnail || img}
                alt={selectedCourseData.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              {selectedCourseData.category && (
                <span className="absolute top-4 left-4 bg-indigo-500/20 backdrop-blur-md border border-indigo-500/40 text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {selectedCourseData.category}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {selectedCourseData.title}
              </h1>
              {selectedCourseData.subTitle && (
                <p className="text-slate-400 text-lg mt-3 leading-relaxed">
                  {selectedCourseData.subTitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{avgRating}</span>
                  <span className="text-slate-400 font-normal text-xs">
                    ({selectedCourseData.reviews?.length || 0} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>
                    {selectedCourseData.lectures?.length || 0} Lectures Included
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Action & Pricing Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="flex items-baseline justify-between border-b border-slate-800 pb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                    Course Price
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    ₹{selectedCourseData.price}
                  </span>
                </div>
                {isEnrolled && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Enrolled
                  </span>
                )}
              </div>

              {/* CTAs */}
              <div>
                {!isEnrolled ? (
                  <button
                    onClick={handleEnroll}
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Enroll Now</span>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/viewlecture/${courseId}`)}
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <PlayCircle className="w-5 h-5 fill-white text-emerald-600" />
                    <span>Watch Course Lectures</span>
                  </button>
                )}
              </div>

              <div className="space-y-3 pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>Full Lifetime Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Self-paced video learning</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Preview Player */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-indigo-400" />
            <span>Lecture Preview</span>
          </h2>
          <div className="relative aspect-video max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center shadow-2xl">
            {selectedLecture ? (
              <video
                src={selectedLecture.videoUrl}
                controls
                className="w-full h-full rounded-3xl object-contain bg-black"
              />
            ) : (
              <div className="text-center p-8 space-y-2">
                <PlayCircle className="w-12 h-12 text-slate-600 mx-auto animate-bounce" />
                <p className="text-slate-400 text-sm font-medium">
                  Select any free preview lecture below to start watching
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Course Curriculum List */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">
            Course Curriculum
          </h2>
          <div className="space-y-3">
            {selectedCourseData.lectures?.length > 0 ? (
              selectedCourseData.lectures.map((lecture, index) => {
                const isPreview = lecture.isPreviewFree;
                return (
                  <button
                    key={lecture._id || index}
                    onClick={() => isPreview && setSelectedLecture(lecture)}
                    disabled={!isPreview}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                      selectedLecture?._id === lecture._id
                        ? "bg-indigo-600/20 border-indigo-500 text-white"
                        : isPreview
                        ? "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-200 cursor-pointer"
                        : "bg-slate-950/40 border-slate-800/50 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isPreview ? (
                        <PlayCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-600 flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium">
                        {index + 1}. {lecture.lectureTitle}
                      </span>
                    </div>

                    {isPreview && (
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                        Preview
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <p className="text-slate-500 text-sm italic">
                No lectures uploaded for this course yet.
              </p>
            )}
          </div>
        </div>

        {/* Review Submission Section */}
        <div className="mb-16 p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <span>Leave a Review</span>
          </h2>

          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className={`w-6 h-6 cursor-pointer transition-colors ${
                  star <= (hoverRating || rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-slate-700"
                }`}
              />
            ))}
            <span className="text-xs text-slate-400 ml-2">
              {rating > 0 ? `${rating} Stars Selected` : "Select a rating"}
            </span>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
            placeholder="Share your thoughts about this course..."
          />

          <button
            onClick={handleReview}
            className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md"
          >
            Submit Review
          </button>
        </div>

        {/* Instructor Profile */}
        {creatorData && (
          <div className="mb-16 p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={creatorData?.photoUrl || img}
              alt={creatorData?.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500/40"
            />
            <div className="text-center sm:text-left">
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">
                Instructor
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {creatorData?.name}
              </h3>
              {creatorData?.description && (
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  {creatorData?.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* More Courses by Instructor */}
        {selectedCreatorCourse.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              More Courses by {creatorData?.name || "this Creator"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCreatorCourse.map((course) => (
                <Card
                  key={course._id}
                  id={course._id}
                  thumbnail={course.thumbnail}
                  title={course.title}
                  price={course.price}
                  category={course.category}
                  reviews={course.reviews}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewCourse;