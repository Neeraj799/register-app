import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { UserContext } from "../context/UserContext";

const Home = () => {
  const { userData, setUserData, loading, setLoading } =
    useContext(UserContext);

  const [token, setToken] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      setToken(token);
      console.log(token);

      if (!token) {
        navigate("/unauthorized");
        return;
      }

      const decodedToken = jwtDecode(token);

      const id = decodedToken?.userId;

      if (!id) {
        toast.error("Invalid user data. Please login again.", {
          position: "top-right",
        });
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/auth/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserData(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Internal Server Error", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : userData ? (
          <div className="flex flex-wrap gap-4 justify-center">
            <div key={userData._id}>
              <div>Welcome {userData.name} !</div>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500 mt-4">
            User data not found.
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
