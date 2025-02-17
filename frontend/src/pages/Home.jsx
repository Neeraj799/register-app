import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { UserContext } from "../context/UserContext";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../config";
import { GlobalContext } from "../context/GlobalContext";

const Home = () => {
  const { userData, setUserData } = useContext(UserContext);

  const { loading, setLoading } = useContext(GlobalContext);

  const { token, isAuthenticated } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate("/login");
    }

    fetchData();
  }, [isAuthenticated, token]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (!token) {
        navigate("/login");
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

      const response = await axios.get(`${BASE_URL}/auth/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
