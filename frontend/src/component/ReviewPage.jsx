import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import { useSelector } from "react-redux";
import { Sparkles, Star, MessageSquareQuote, CheckCircle2 } from "lucide-react";

function ReviewPage() {
  const [reviewsList, setReviewsList] = useState([]);
  const { allReview = [] } = useSelector((state) => state.review || {});

  // High-quality fallback testimonials when backend has few or empty reviews
  const fallbackReviews = [
    {
      comment: "The AI Voice Assistant during lectures is game-changing. Whenever I was confused about React hooks, I just asked the mic and got immediate clarity!",
      rating: 5,
      user: { name: "Aarav Sharma", role: "Frontend Developer", photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
    },
    {
      comment: "Comprehensive curriculum that actually mirrors real industry tasks. Completed the Fullstack course and landed my junior engineer role within 2 months.",
      rating: 5,
      user: { name: "Sophia Miller", role: "Software Engineer", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
    },
    {
      comment: "The ability to take timestamped study notes and download verified PDF certificates made tracking my upskilling journey effortless.",
      rating: 5,
      user: { name: "Rahul Verma", role: "Data Science Enthusiast", photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" },
    },
    {
      comment: "As an educator, publishing my course and monitoring student analytics was remarkably intuitive. Creator tools here are top-tier.",
      rating: 5,
      user: { name: "Elena Rostova", role: "Course Instructor", photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" },
    },
    {
      comment: "The AI quiz generator at the end of each lesson really tests if you paid attention. Highly recommend Virtual Courses to all learners!",
      rating: 5,
      user: { name: "David Kim", role: "Product Designer", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
    },
    {
      comment: "Clean UI, zero distraction video player, fast streaming, and instant course discovery with Gemini AI. 10/10 learning platform.",
      rating: 5,
      user: { name: "Priya Patel", role: "CS Student", photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
    },
  ];

  useEffect(() => {
    if (Array.isArray(allReview) && allReview.length > 0) {
      setReviewsList(allReview.slice(0, 6));
    } else {
      setReviewsList(fallbackReviews);
    }
  }, [allReview]);

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-950/60 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-300 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Learner Success Stories</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Loved by Learners &{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-amber-300 bg-clip-text text-transparent">
              Creators Worldwide
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            See how students and instructors are leveraging Virtual Courses to elevate their careers and master new skills.
          </p>

          {/* Social Proof Rating Pill */}
          <div className="inline-flex items-center gap-3 pt-2">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-200">
              4.9/5 from 2,500+ student reviews
            </span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewsList.map((item, index) => {
            const userName = item?.user?.name || "Student";
            const userRole = item?.user?.role || "Learner";
            const userPhoto = item?.user?.photoUrl || "";
            const reviewComment = item?.comment || item?.text || "";
            const userRating = item?.rating || 5;

            return (
              <ReviewCard
                key={index}
                rating={userRating}
                image={userPhoto}
                text={reviewComment}
                name={userName}
                role={userRole}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ReviewPage;
