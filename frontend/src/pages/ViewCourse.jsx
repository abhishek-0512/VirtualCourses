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
  MessageSquare,
  Clock,
  Award,
  Layers,
  Infinity as InfinityIcon,
  HelpCircle,
  ChevronDown,
  Bookmark
} from "lucide-react";
import Card from "../component/Card.jsx";
import Nav from "../component/Nav";
import Footer from "../component/Footer";
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
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Check bookmark status
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("vc_bookmarks") || "[]");
      setIsBookmarked(saved.some((c) => (c._id || c.id) === courseId));
    } catch (e) {
      setIsBookmarked(false);
    }
  }, [courseId]);

  const toggleBookmark = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("vc_bookmarks") || "[]");
      const exists = saved.some((c) => (c._id || c.id) === courseId);
      let updated;
      if (exists) {
        updated = saved.filter((c) => (c._id || c.id) !== courseId);
        toast.info("Course removed from bookmarks");
      } else {
        updated = [...saved, { _id: courseId, id: courseId, title: selectedCourseData?.title, thumbnail: selectedCourseData?.thumbnail, price: selectedCourseData?.price, category: selectedCourseData?.category }];
        toast.success("Course saved to bookmarks!");
      }
      localStorage.setItem("vc_bookmarks", JSON.stringify(updated));
      setIsBookmarked(!exists);
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error(e);
    }
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Average Rating Calculation
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "5.0";
    const total = reviews.reduce((sum, item) => sum + item.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(selectedCourseData?.reviews);

  // Fetch Course
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
      toast.error("Course details not found");
    }
  };

  // Enrollment Check
  const checkEnrollment = () => {
    const verify = userData?.enrolledCourses?.some((course) => {
      const id = typeof course === "string" ? course : course._id;
      return id?.toString() === courseId?.toString();
    });
    setIsEnrolled(verify || false);
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    checkEnrollment();
  }, [userData, courseId]);

  // Auto-select first preview lecture
  useEffect(() => {
    if (selectedCourseData?.lectures?.length > 0) {
      const firstLec =
        selectedCourseData.lectures.find(
          (lec) => lec.isPreviewFree || lec.isFree
        ) || selectedCourseData.lectures[0];

      setSelectedLecture(firstLec);
    }
  }, [selectedCourseData]);

  // Fetch Creator Data
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

  // Other Courses by Creator
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

  // Review Handler
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

      toast.success(data.message || "Review submitted successfully!");
      setComment("");
      fetchCourseData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Review failed");
    }
  };

  // Payment / Enrollment Handler
  const handleEnroll = async () => {
    if (!userData) {
      toast.info("Please sign in to enroll in this course");
      navigate("/login");
      return;
    }

    setEnrolling(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Payment SDK failed to load. Please check internet connection.");
        setEnrolling(false);
        return;
      }

      const { data } = await axios.post(
        `${serverUrl}/api/payment/create-order`,
        { courseId },
        { withCredentials: true }
      );

      // Support free course enrollment
      if (data.isFree) {
        toast.success(data.message || "Enrolled successfully in free course!");
        setIsEnrolled(true);
        setEnrolling(false);
        return;
      }

      const orderData = data.order || data;
      const razorpayKey =
        data.key_id ||
        data.razorpayKeyId ||
        import.meta.env.VITE_RAZORPAY_KEY_ID ||
        "rzp_test_placeholder";

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Virtual Courses",
        description: selectedCourseData.title || selectedCourseData.courseTitle,
        order_id: orderData.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
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

            if (verifyRes.data.success) {
              toast.success(verifyRes.data.message || "Enrolled successfully!");
              setIsEnrolled(true);
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            toast.error(error.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {
          name: userData?.name || "",
          email: userData?.email || "",
        },
        theme: {
          color: "#6366f1",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error(error.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  const rawVideoUrl =
    selectedLecture?.videoUrl ||
    selectedLecture?.lectureUrl ||
    selectedLecture?.publicUrl ||
    selectedLecture?.url ||
    selectedLecture?.video ||
    "";

  const previewVideoUrl = rawVideoUrl.includes("gtv-videos-bucket")
    ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    : rawVideoUrl;

  const title = selectedCourseData?.title || selectedCourseData?.courseTitle || "Course Details";
  const category = selectedCourseData?.category || "General";
  const level = selectedCourseData?.courseLevel || selectedCourseData?.level || "Beginner";
  const price = selectedCourseData?.price ?? selectedCourseData?.coursePrice ?? 0;
  const lecturesList = selectedCourseData?.lectures || [];

  if (!selectedCourseData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Loading course syllabus...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500">
      <Nav />

      <div className="max-w-7xl mx-auto pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        
        {/* Back button */}
        <button
          onClick={() => navigate("/allcourses")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to All Courses</span>
        </button>

        {/* Hero Grid: Main Info + Sticky Pricing Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column (8 cols): Title, Subtitle, Preview Video, Features */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Category & Level Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {category}
              </span>
              <span className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold px-3 py-1 rounded-full">
                {level} Level
              </span>
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{avgRating}</span>
                <span className="text-slate-400 font-normal">
                  ({selectedCourseData.reviews?.length || 18} reviews)
                </span>
              </div>
            </div>

            {/* Course Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {title}
            </h1>

            {/* Subtitle / Description */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              {selectedCourseData.subTitle || selectedCourseData.description || "Master real-world skills with step-by-step guidance from industry experts and AI tutoring."}
            </p>

            {/* Preview Video Player Box */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-indigo-400" />
                  <span>Free Preview Player</span>
                </h3>
                {selectedLecture && (
                  <span className="text-xs text-indigo-400 font-medium">
                    Now Previewing: {selectedLecture.lectureTitle || selectedLecture.title || "Lesson 1"}
                  </span>
                )}
              </div>

              <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl flex items-center justify-center">
                {previewVideoUrl ? (
                  <video
                    key={selectedLecture?._id || previewVideoUrl}
                    src={previewVideoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <div className="text-center p-8 space-y-2">
                    <img
                      src={selectedCourseData.thumbnail || selectedCourseData.courseThumbnail || img}
                      alt={title}
                      className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                    <PlayCircle className="w-12 h-12 text-indigo-400 mx-auto relative z-10" />
                    <p className="text-slate-300 text-sm font-semibold relative z-10">
                      Select a free preview lesson below to watch
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* What you'll learn checklist */}
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>What You Will Master in This Course</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "Build production-grade projects ready for your portfolio",
                  "Understand core architecture patterns and best coding practices",
                  "Interact with 24/7 AI tutor for live code explanations",
                  "Earn an industry-verifiable PDF completion certificate",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Sticky Checkout & Features Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
              
              {/* Thumbnail Mini */}
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800">
                <img
                  src={selectedCourseData.thumbnail || selectedCourseData.courseThumbnail || img}
                  alt={title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={toggleBookmark}
                  className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-amber-400 transition-all cursor-pointer"
                  title="Bookmark Course"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
                </button>
              </div>

              {/* Pricing Section */}
              <div className="border-b border-slate-800 pb-6 space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                  Course Enrollment
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    {price > 0 ? `₹${price}` : "FREE"}
                  </span>
                  {price > 0 && (
                    <span className="text-sm text-slate-500 line-through">
                      ₹{Math.round(price * 1.6)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {!isEnrolled ? (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-600 to-indigo-600 hover:from-indigo-600 hover:to-violet-700 text-white font-black text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    <span>{enrolling ? "Connecting to Payment..." : price > 0 ? "Enroll Now • ₹" + price : "Enroll Free"}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/viewlecture/${courseId}`)}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <PlayCircle className="w-5 h-5" />
                    <span>Watch Course Lectures</span>
                  </button>
                )}
              </div>

              {/* Value Guarantees */}
              <div className="space-y-3 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <InfinityIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Full Lifetime Access on Mobile & Desktop</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Verified Certificate of Completion Included</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Gemini Voice Tutor & Lesson Quizzes</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Course Curriculum Accordion Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white">
                Course Curriculum
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {lecturesList.length} Lessons • Self-Paced Learning
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {lecturesList.length > 0 ? (
              lecturesList.map((lecture, index) => {
                const isPreview = lecture.isPreviewFree || lecture.isFree || index === 0;
                const lecTitle = lecture.lectureTitle || lecture.title || `Lecture ${index + 1}`;

                return (
                  <div
                    key={lecture._id || index}
                    onClick={() => isPreview && setSelectedLecture(lecture)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      selectedLecture?._id === lecture._id
                        ? "bg-indigo-600/20 border-indigo-500 text-white"
                        : isPreview
                        ? "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-200 cursor-pointer"
                        : "bg-slate-950/40 border-slate-800/40 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {isPreview ? (
                        <PlayCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <span className="text-xs sm:text-sm font-semibold truncate">
                        {index + 1}. {lecTitle}
                      </span>
                    </div>

                    {isPreview ? (
                      <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full shrink-0">
                        Free Preview
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-600 shrink-0">
                        Enroll to Unlock
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-slate-500 text-xs italic py-4">
                No lectures uploaded for this course yet.
              </p>
            )}
          </div>
        </div>

        {/* Instructor Profile */}
        {creatorData && (
          <div className="mb-16 p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={creatorData?.photoUrl || "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(creatorData?.name || "Instructor")}
              alt={creatorData?.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
              referrerPolicy="no-referrer"
            />
            <div className="text-center sm:text-left flex-1">
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">
                Lead Instructor
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {creatorData?.name}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed max-w-2xl">
                {creatorData?.description || "Senior educator specializing in practical, industry-proven workflows and interactive course design."}
              </p>
            </div>
          </div>
        )}

        {/* Leave a Review Section */}
        <div className="mb-16 p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span>Rate & Review This Course</span>
          </h3>

          <div className="flex items-center gap-2">
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
            <span className="text-xs text-slate-400 ml-2 font-medium">
              {rating} Stars
            </span>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600 resize-none"
            placeholder="Share your learning experience and feedback on this course..."
          />

          <button
            onClick={handleReview}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            Submit Review
          </button>
        </div>

        {/* More Courses by Instructor */}
        {selectedCreatorCourse.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">
              More Courses by {creatorData?.name || "this Creator"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCreatorCourse.map((course) => (
                <Card
                  key={course._id}
                  id={course._id}
                  thumbnail={course.thumbnail || course.courseThumbnail}
                  title={course.title || course.courseTitle}
                  price={course.price ?? course.coursePrice}
                  category={course.category}
                  reviews={course.reviews}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}

export default ViewCourse;