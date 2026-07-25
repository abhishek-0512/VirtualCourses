import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

import Dashboard from "./pages/admin/Dashboard";
import AddCourses from "./pages/admin/AddCourses";
import CreateCourse from "./pages/admin/CreateCourse";
import CreateLecture from "./pages/admin/CreateLecture";
import EditLecture from "./pages/admin/EditLecture";

import Courses from "./pages/Courses";
import AllCourses from "./pages/AllCourses";
import ViewCourse from "./pages/ViewCourse";
import EnrolledCourses from "./pages/EnrolledCourses";
import ViewLecture from "./pages/ViewLecture";
import SearchWithAi from "./pages/SearchWithAi";

// Components
import ScrollToTop from "./component/ScrollToTop";
import GeminiVoiceAssistant from "./component/GeminiVoiceAssistant";

// Custom Hooks
import useGetCurrentUser from "./customHooks/getCurrentUser";
import useGetCourseData from "./customHooks/getCouseData";
import useGetCreatorCourseData from "./customHooks/getCreatorCourseData";
import useGetAllReviews from "./customHooks/getAllReviews";

// Dynamic Server URL for Production Deployment (Vercel / Netlify environment variable)
export const serverUrl =
  import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

// --- Route Guard Helpers ---
const ProtectedRoute = ({ user, role, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  
  // Allow matching either educator or instructor role definitions
  if (role && user.role !== role && user.role !== "instructor") {
    return <Navigate to="/" replace />;
  }
  return children;
};

const PublicOnlyRoute = ({ user, children }) => {
  if (user) return <Navigate to="/" replace />;
  return children;
};

function App() {
  const { userData, loading } = useSelector((state) => state.user);

  // Initialize global application data
  useGetCurrentUser();
  useGetCourseData();
  useGetCreatorCourseData();
  useGetAllReviews();

  // Prevent UI flash while checking authentication state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <ScrollToTop />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        {/* Auth Routes (Only accessible when logged out) */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute user={userData}>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute user={userData}>
              <SignUp />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/forgotpassword"
          element={
            <PublicOnlyRoute user={userData}>
              <ForgotPassword />
            </PublicOnlyRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={userData}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editprofile"
          element={
            <ProtectedRoute user={userData}>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/allcourses"
          element={
            <ProtectedRoute user={userData}>
              <AllCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewcourse/:courseId"
          element={
            <ProtectedRoute user={userData}>
              <ViewCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/enrolledcourses"
          element={
            <ProtectedRoute user={userData}>
              <EnrolledCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewlecture/:courseId"
          element={
            <ProtectedRoute user={userData}>
              <ViewLecture />
            </ProtectedRoute>
          }
        />
        <Route
          path="/searchwithai"
          element={
            <ProtectedRoute user={userData}>
              <SearchWithAi />
            </ProtectedRoute>
          }
        />

        {/* Educator Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={userData} role="educator">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute user={userData} role="educator">
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addcourses/:courseId"
          element={
            <ProtectedRoute user={userData} role="educator">
              <AddCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createcourses"
          element={
            <ProtectedRoute user={userData} role="educator">
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createlecture/:courseId"
          element={
            <ProtectedRoute user={userData} role="educator">
              <CreateLecture />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editlecture/:courseId/:lectureId"
          element={
            <ProtectedRoute user={userData} role="educator">
              <EditLecture />
            </ProtectedRoute>
          }
        />

        {/* Fallback Catch-All Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Site-wide Gemini Voice Assistant */}
      <GeminiVoiceAssistant />
    </>
  );
}

export default App;