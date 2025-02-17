import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LuAlignLeft } from "react-icons/lu";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <div className="flex items-center justify-between py-5">
        <span className=" sm:flex  text-2xl font-extrabold text-blue-600">
          FLIPKART
        </span>

        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          <NavLink to="/" className="flex flex-col items-center gap-1">
            <p>HOME</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"></hr>
          </NavLink>
          <NavLink
            to="/collection"
            className="flex flex-col items-center gap-1"
          >
            <p>COLLECTION</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"></hr>
          </NavLink>

          <NavLink to="/profile" className="flex flex-col items-center gap-1">
            <p>PROFILE</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"></hr>
          </NavLink>
        </ul>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="hidden sm:block bg-blue-600 border rounded-md p-2 text-white  "
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="hidden sm:block bg-blue-600 border rounded-md p-2 text-white  "
          >
            Login
          </button>
        )}
        <div className="flex sm:hidden">
          <LuAlignLeft onClick={() => setVisible(true)} className="size-7 " />
        </div>

        {visible && (
          <div className="absolute top-14 right-10  h-auto bg-white overflow-hidden transition-all shadow-lg">
            <div className="flex flex-col text-gray-600">
              <NavLink
                onClick={() => setVisible(false)}
                className="py-2 p-6 border "
                to="/"
              >
                HOME
              </NavLink>

              <NavLink
                onClick={() => setVisible(false)}
                className="py-2 p-6 border"
                to="/collection"
              >
                COLLECTION
              </NavLink>

              <NavLink
                onClick={() => setVisible(false)}
                className="py-2 p-6 border"
                to="/profile"
              >
                PROFILE
              </NavLink>

              {isAuthenticated ? (
                <div onClick={handleLogout} className="py-2 p-6 border">
                  Logout
                </div>
              ) : (
                <div
                  onClick={() => navigate("/login")}
                  className="py-2 p-6 border"
                >
                  Login
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
