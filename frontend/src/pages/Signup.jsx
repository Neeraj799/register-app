import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { BASE_URL } from "../config";
import axios from "axios";

const Signup = () => {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // const signupValidationSchema = yup.object().shape({
  //   name: yup
  //     .string()
  //     .min(3, "Name must be atleast 3 characters long")
  //     .required("Name is required"),
  //   email: yup
  //     .string()
  //     .email("Email must be a valid email")
  //     .required("Email is required"),

  //   password: yup
  //     .string()
  //     .min(6, "Password must be a atleast 6 characters long")
  //     .required("Password is required"),
  // });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // try {
    //   await signupValidationSchema.validate(signupInfo, { abortEarly: false });
    // } catch (validationErrors) {
    //   const errors = {};
    //   validationErrors.inner.forEach((err) => {
    //     errors[err.path] = err.message;
    //   });
    //   setErrors(errors);
    //   return;
    // }

    try {
      const url = `${BASE_URL}/auth/register`;
      const response = await axios.post(url, signupInfo, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.data;

      if (result.success) {
        toast.success(result.message, {
          position: "top-right",
        });
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        const validationErrors = {};

        err.response.data.error.forEach((err) => {
          const fieldName = err.path[0];
          validationErrors[fieldName] = err.message;
        });
        setErrors(validationErrors);
      } else {
        toast.error(err.response?.data?.message || "Signup failed", {
          position: "top-right",
        });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name
          </label>
          <input
            onChange={handleChange}
            type="text"
            name="name"
            placeholder="Enter your name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
            value={signupInfo.name}
          />
          {errors && errors.name && (
            <p className="text-red-500 text-sm">{errors.name}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="Enter your email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
            value={signupInfo.email}
          />
          {errors && errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter your password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
            value={signupInfo.password}
          />
          {errors && errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Signup
          </button>
        </div>
        <div>
          Already have an account?
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
