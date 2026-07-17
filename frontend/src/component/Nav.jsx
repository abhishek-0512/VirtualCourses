import React from "react";
import { IoPersonCircle } from "react-icons/io5";

function Nav({ userData, navigate, logout }) {
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="w-[30%] lg:flex items-center justify-center gap-4">

      {/* Profile Icon (only when logged out) */}
      {!userData && (
        <IoPersonCircle
          onClick={() => navigate("/login")}
          className="w-[50px] h-[50px] fill-black cursor-pointer"
        />
      )}

      {/* First Letter Avatar (only when logged in) */}
      {userData && (
        <div
          className="w-[50px] h-[50px] rounded-full text-white flex items-center justify-center
          text-[20px] border-2 bg-black border-white cursor-pointer"
        >
          {userData?.name.slice(0, 1).toUpperCase()}
        </div>
      )}

      {/* Dashboard Button (Only Educator) */}
      {userData?.role === "educator" && (
        <div
          onClick={() => navigate("/educator")}
          className="px-[20px] py-[10px] border-2 border-white text-white bg-[black] rounded-[10px] text-[18px] font-light cursor-pointer"
        >
          Dashboard
        </div>
      )}

      {/* Login Button */}
      {!userData ? (
        <span
          onClick={() => navigate("/login")}
          className="px-[20px] py-[10px] border-2 border-white text-white rounded-[10px] text-[18px] font-light cursor-pointer bg-[#000000d5]"
        >
          Login
        </span>
      ) : (
        /* Logout Button */
        <span
          onClick={handleLogout}
          className="px-[20px] py-[10px] bg-white text-black rounded-[10px] shadow-sm shadow-black text-[18px] cursor-pointer"
        >
          LogOut
        </span>
      )}
    </div>
  );
}

export default Nav;