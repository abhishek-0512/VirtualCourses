import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEye, IoEyeOutline } from "react-icons/io5";
import logo from "../assets/logo.jpg";
import google from "../assets/google.jpg";

function SignUp() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-[#dddddb] w-screen h-screen flex items-center justify-center">
      <form className="w-[90%] md:w-[900px] h-[600px] bg-white rounded-2xl shadow-xl flex overflow-hidden">

        {/* Left Div */}
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
            <label htmlFor="name" className="font-semibold">
              Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Your Name"
              className="border border-[#e7e6e6] h-[40px] rounded-md px-4 outline-none focus:border-black"
            />
          </div>

          {/* Email */}
          <div className="w-[80%] flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Your Email"
              className="border border-[#e7e6e6] h-[40px] rounded-md px-4 outline-none focus:border-black"
            />
          </div>

          {/* Password */}
          <div className="w-[80%] flex flex-col gap-1 relative">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>

            <input
              id="password"
              type={show ? "text" : "password"}
              placeholder="Your Password"
              className="border border-[#e7e6e6] h-[40px] rounded-md px-4 pr-12 outline-none focus:border-black"
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
          <div className="w-[80%] flex justify-between">
            <span className="px-4 py-2 border border-[#e7e6e6] rounded-xl cursor-pointer hover:border-black">
              Student
            </span>

            <span className="px-4 py-2 border border-[#e7e6e6] rounded-xl cursor-pointer hover:border-black">
              Educator
            </span>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-[80%] h-[45px] bg-black text-white rounded-md font-semibold hover:bg-[#222] transition"
          >
            Sign Up
          </button>

          {/* Or Continue */}
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

          {/* Already have an account */}
          <div className="text-[#6f6f6f] text-[15px]">
            Already have an account{" "}
            <span
              className="underline underline-offset-1 text-black cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </div>

        </div>

        {/* Right Div */}
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