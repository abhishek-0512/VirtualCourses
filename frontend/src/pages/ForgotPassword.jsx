import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { 
  GraduationCap, 
  Mail, 
  KeyRound, 
  Lock, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck 
} from "lucide-react";
import { serverUrl } from "../App";
import { toast } from "react-toastify";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [newpassword, setNewPassword] = useState("");
  const [conPassword, setConpassword] = useState("");

  const handleStep1 = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/sendotp`,
        { email },
        { withCredentials: true }
      );
      setStep(2);
      toast.success(result.data.message || "OTP code sent to your email!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verifyotp`,
        { email, otp },
        { withCredentials: true }
      );
      toast.success(result.data.message || "OTP verified successfully!");
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP code");
    } finally {
      setLoading(false);
    }
  };

  const handleStep3 = async (e) => {
    e.preventDefault();
    if (newpassword !== conPassword) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/resetpassword`,
        { email, password: newpassword },
        { withCredentials: true }
      );
      toast.success(result.data.message || "Password reset successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset password failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-indigo-500">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl space-y-6">
        
        {/* Step 1: Request OTP */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-white">Forgot Password</h1>
              <p className="text-xs text-slate-400">
                Enter your registered email and we'll send an OTP code.
              </p>
            </div>

            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send OTP Code"}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 mb-2">
                <Mail className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-white">Enter 6-Digit OTP</h1>
              <p className="text-xs text-slate-400">
                Check your inbox at <strong className="text-white">{email}</strong>
              </p>
            </div>

            <form onSubmit={handleStep2} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-center text-lg font-mono font-bold text-indigo-400 tracking-widest focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Code"}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-white">Set New Password</h1>
              <p className="text-xs text-slate-400">
                Create a secure password with at least 6 characters.
              </p>
            </div>

            <form onSubmit={handleStep3} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                  <input
                    type="password"
                    value={newpassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                  <input
                    type="password"
                    value={conPassword}
                    onChange={(e) => setConpassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save New Password"}
              </button>
            </form>
          </div>
        )}

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;
