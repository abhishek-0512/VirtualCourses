import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Nav from "../component/Nav";

function Home() {
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.user);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="w-full h-[80px] bg-[#d9d9d9] flex items-center justify-between px-10">
        {/* Logo */}

        <img
          src="/logo.jpg"
          alt="logo"
          className="w-[60px] h-[60px] rounded-md cursor-pointer"
        />

        {/* Right Side */}

        <Nav
          userData={userData}
          navigate={navigate}
          logout={logout}
        />
      </div>
    </div>
  );
}

export default Home;