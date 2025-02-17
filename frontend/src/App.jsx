import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Unauthorized from "./pages/Unauthorized";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import Collection from "./pages/Collection";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AdminLogin from "./pages/AdminLogin";

function App() {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/login",
    "/signUp",
    "/adminLogin",
    "/adminDashboard",
  ];

  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <ToastContainer />
        {showNavbar && <Navbar />}
        <Routes>
          <Route path="/signUp" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
