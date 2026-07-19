import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

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

import ScrollToTop from "./component/ScrollToTop";

// ✅ Custom Hooks
import useGetCurrentUser from "./customHooks/getCurrentUser";
import useGetCourseData from "./customHooks/getCouseData";
import useGetCreatorCourseData from "./customHooks/getCreatorCourseData";
import useGetAllReviews from "./customHooks/getAllReviews";

export const serverUrl = "http://localhost:8000";

function App() {
  const { userData } = useSelector((state) => state.user);

  // Custom Hooks
  useGetCurrentUser();
  useGetCourseData();
  useGetCreatorCourseData();
  useGetAllReviews();

  return (
    <>
      <ToastContainer />
      <ScrollToTop />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to="/" />}
        />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Student Routes */}
        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to="/signup" />}
        />
        <Route
          path="/editprofile"
          element={userData ? <EditProfile /> : <Navigate to="/signup" />}
        />
        <Route
          path="/allcourses"
          element={userData ? <AllCourses /> : <Navigate to="/signup" />}
        />
        <Route
          path="/viewcourse/:courseId"
          element={userData ? <ViewCourse /> : <Navigate to="/signup" />}
        />
        <Route
          path="/enrolledcourses"
          element={userData ? <EnrolledCourses /> : <Navigate to="/signup" />}
        />
        <Route
          path="/viewlecture/:courseId"
          element={userData ? <ViewLecture /> : <Navigate to="/signup" />}
        />
        <Route
          path="/searchwithai"
          element={userData ? <SearchWithAi /> : <Navigate to="/signup" />}
        />

        {/* Educator Routes */}
        <Route
          path="/dashboard"
          element={
            userData?.role === "educator" ? (
              <Dashboard />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
        <Route
          path="/courses"
          element={
            userData?.role === "educator" ? (
              <Courses />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
        <Route
          path="/addcourses/:courseId"
          element={
            userData?.role === "educator" ? (
              <AddCourses />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
        <Route
          path="/createcourses"
          element={
            userData?.role === "educator" ? (
              <CreateCourse />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
        <Route
          path="/createlecture/:courseId"
          element={
            userData?.role === "educator" ? (
              <CreateLecture />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
        <Route
          path="/editlecture/:courseId/:lectureId"
          element={
            userData?.role === "educator" ? (
              <EditLecture />
            ) : (
              <Navigate to="/signup" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;