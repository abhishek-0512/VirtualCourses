import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import google from "../assets/google.jpg";
import axios from "axios";
import { serverUrl } from "../App";
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(serverUrl + "/api/auth/signup", { name, email, password, role }, { withCredentials: true });
      dispatch(setUserData(result.data));
      navigate("/");
      toast.success("SignUp Successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const googleSignUp = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      const result = await axios.post(serverUrl + "/api/auth/googlesignup", { name: user.displayName, email: user.email, role }, { withCredentials: true });
      dispatch(setUserData(result.data));
      navigate("/");
      toast.success("SignUp Successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Google sign up failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_right,_rgba(15,23,42,0.95),_rgba(59,130,246,0.18)_55%,_#f8fafc_100%)] px-4 py-8">
      <div className="glass-panel flex w-full max-w-6xl overflow-hidden rounded-[32px]">
        <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-10 lg:w-[52%] lg:px-12">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Start learning</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Create your account</h1>
            <p className="mt-2 text-sm text-slate-500">Join a beautifully crafted learning community in minutes.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">Name</label>
              <input id="name" type="text" className="input-shell" placeholder="Your name" onChange={(e) => setName(e.target.value)} value={name} />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input id="email" type="email" className="input-shell" placeholder="Your email" onChange={(e) => setEmail(e.target.value)} value={email} />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input id="password" type={show ? "text" : "password"} className="input-shell pr-12" placeholder="Create a password" onChange={(e) => setPassword(e.target.value)} value={password} />
                {show ? (
                  <MdRemoveRedEye className="absolute right-3 top-3 h-5 w-5 cursor-pointer text-slate-500" onClick={() => setShow((prev) => !prev)} />
                ) : (
                  <MdOutlineRemoveRedEye className="absolute right-3 top-3 h-5 w-5 cursor-pointer text-slate-500" onClick={() => setShow((prev) => !prev)} />
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" className={`rounded-full border px-4 py-2 text-sm font-medium transition ${role === "student" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`} onClick={() => setRole("student")}>Student</button>
            <button type="button" className={`rounded-full border px-4 py-2 text-sm font-medium transition ${role === "educator" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`} onClick={() => setRole("educator")}>Educator</button>
          </div>

          <button className="mt-6 flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800" disabled={loading} onClick={handleSignUp}>
            {loading ? <ClipLoader size={18} color="white" /> : "Create account"}
          </button>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm text-slate-400">or continue with</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button className="mt-5 flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" onClick={googleSignUp}>
            <img src={google} alt="Google" className="h-5 w-5" />
            Continue with Google
          </button>

          <p className="mt-6 text-sm text-slate-500">
            Already have an account? <span className="cursor-pointer font-semibold text-slate-900" onClick={() => navigate("/login")}>Log in</span>
          </p>
        </div>

        <div className="hidden w-[48%] flex-col items-center justify-center bg-slate-950 px-8 py-10 text-center text-white lg:flex">
          <img src={logo} className="mb-6 h-24 w-24 rounded-3xl border border-white/10 object-cover shadow-2xl" alt="Virtual Courses" />
          <h2 className="text-3xl font-semibold">Virtual Courses</h2>
          <p className="mt-3 max-w-sm text-sm leading-7 text-slate-300">Create your identity, join a thriving learning network, and start sharing knowledge with clarity.</p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
