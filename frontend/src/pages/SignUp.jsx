import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEye, IoEyeOutline } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";

import logo from "../assets/logo.jpg";
import google from "../assets/google.jpg";

const serverUrl = "http://localhost:8000";

function SignUp() {
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const result = await axios.post(
        serverUrl + "/api/auth/signup",
        {
          name,
          email,
          password,
          role,
        },
        {
          withCredentials: true,
        } 
      );

      dispatch(setUserData(result.data))

      setLoading(false);

      toast.success("Signup Successfully");

      navigate("/login");
    } catch (error) {
      console.log(error);

      setLoading(false);

      toast.error(error.response?.data?.message || "Signup Failed");
    }
  };

  return (
    <div className="bg-[#dddddb] w-screen h-screen flex items-center justify-center">
      <form
        onSubmit={handleSignup}
        className="w-[90%] md:w-[900px] h-[600px] bg-white rounded-2xl shadow-xl flex overflow-hidden"
      >
        {/* Left Section */}
        <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center gap-4">
          {/* Heading */}
          <div className="w-[80%] flex flex-col items-center text-center">
            <h1 className="text-3xl font-semibold text-black">
              Let's get started
            </h1>

            <h2 className="text-[#999797] text-[17px] mt-1">
              Create your account
            </h2>
          </div>

          {/* Name */}
          <div className="w-[80%] flex flex-col gap-1">
            <label className="font-semibold">Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="border border-[#e7e6e6] h-[40px] rounded-md px-4 outline-none focus:border-black"
              required
            />
          </div>

          {/* Email */}
          <div className="w-[80%] flex flex-col gap-1">
            <label className="font-semibold">Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              className="border border-[#e7e6e6] h-[40px] rounded-md px-4 outline-none focus:border-black"
              required
            />
          </div>

          {/* Password */}
          <div className="w-[80%] flex flex-col gap-1 relative">
            <label className="font-semibold">Password</label>

            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your Password"
              className="border border-[#e7e6e6] h-[40px] rounded-md px-4 pr-12 outline-none focus:border-black"
              required
            />

            {show ? (
              <IoEye
                onClick={() => setShow(false)}
                className="absolute right-4 bottom-3 text-xl cursor-pointer"
              />
            ) : (
              <IoEyeOutline
                onClick={() => setShow(true)}
                className="absolute right-4 bottom-3 text-xl cursor-pointer"
              />
            )}
          </div>

          {/* Student / Educator */}
          <div className="w-[80%] flex gap-4">
            <div
              onClick={() => setRole("student")}
              className={`w-1/2 h-[45px] rounded-md border-2 flex items-center justify-center cursor-pointer transition-all ${
                role === "student"
                  ? "border-black bg-gray-100"
                  : "border-[#e7e6e6]"
              }`}
            >
              Student
            </div>

            <div
              onClick={() => setRole("educator")}
              className={`w-1/2 h-[45px] rounded-md border-2 flex items-center justify-center cursor-pointer transition-all ${
                role === "educator"
                  ? "border-black bg-gray-100"
                  : "border-[#e7e6e6]"
              }`}
            >
              Educator
            </div>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-[80%] h-[45px] rounded-md text-white font-semibold flex items-center justify-center transition ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-black hover:bg-[#222]"
            }`}
          >
            {loading ? (
              <ClipLoader color="#fff" size={22} />
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Divider */}
          <div className="w-[80%] flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-[#c4c4c4]"></div>

            <span className="text-[#7a7a7a] text-sm">
              or continue
            </span>

            <div className="flex-1 h-[1px] bg-[#c4c4c4]"></div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="w-[80%] h-[45px] border border-[#e7e6e6] rounded-md flex items-center justify-center gap-3 hover:border-black transition"
          >
            <img
              src={google}
              alt="Google"
              className="w-5 h-5"
            />

            <span className="text-[15px] font-medium text-[#555]">
              Continue with Google
            </span>
          </button>

          {/* Login */}
          <div className="text-[#6f6f6f] text-[15px]">
            Already have an account?{" "}
            <span
              className="underline underline-offset-1 text-black cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex w-1/2 h-full bg-black rounded-r-2xl flex-col items-center justify-center">
          <img
            src={logo}
            alt="Logo"
            className="w-[120px] shadow-2xl"
          />

          <span className="text-white text-2xl font-semibold mt-4 tracking-wide">
            VIRTUAL COURSES
          </span>
        </div>
      </form>
    </div>
  );
}

export default SignUp;