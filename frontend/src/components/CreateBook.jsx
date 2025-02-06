import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

const CreateBook = () => {
  const [updatedData, setUpdatedData] = useState({
    title: "",
    author: "",
    ISBN: "",
    publishedYear: "",
    availableCopies: "",
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({
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

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/unauthorized");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/book/addBook`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.data;

      localStorage.getItem("token", result.token),
        toast.success(result.message, {
          position: "top-right",
        });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        const validationErrors = {};

        err.response.data.error.forEach((error) => {
          validationErrors[error.path[0]] = error.message;
        });
        setErrors(validationErrors);
      } else {
        toast.error(err.response?.data?.message || "", {
          position: "top-right",
        });
      }
    }
  };

  return (
    <div>
      <div className="grid min-h-auto justify-center pt-20">
        <form onSubmit={handleSubmit}>
          <div className="grid rounded-lg shadow-lg py-6 px-10">
            <div className="grid sm:grid-cols-2 text-start gap-6">
              <div>
                <label htmlFor="firstName">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="title"
                  value={updatedData.title}
                  onChange={handleChange}
                  className="w-full border rounded-lg py-2 px-4"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title}</p>
                )}
              </div>
              <div>
                <label htmlFor="author">
                  Author <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="author"
                  placeholder="author"
                  value={updatedData.author}
                  onChange={handleChange}
                  className="w-full border rounded-lg py-2 px-4"
                />
                {errors.author && (
                  <p className="text-red-500 text-sm">{errors.author}</p>
                )}
              </div>
              <div>
                <label htmlFor="ISBN">
                  ISBN <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ISBN"
                  placeholder="ISBN"
                  value={updatedData.ISBN}
                  onChange={handleChange}
                  className="w-full border rounded-lg py-2 px-4"
                />
                {errors.ISBN && (
                  <p className="text-red-500 text-sm">{errors.ISBN}</p>
                )}
              </div>

              <div>
                <label htmlFor="mobile">
                  Published Year<span className="text-red-500">*</span>
                </label>
                <div className="flex items-center relative">
                  <input
                    type="text"
                    name="publishedYear"
                    placeholder="publishedYear"
                    value={updatedData.publishedYear}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded-lg"
                  />
                </div>
                {errors.publishedYear && (
                  <p className="text-red-500 text-sm">{errors.publishedYear}</p>
                )}
              </div>

              <div>
                <label htmlFor="availableCopies">
                  Available Copies<span className="text-red-500">*</span>
                </label>
                <div className="flex items-center relative">
                  <input
                    type="text"
                    name="availableCopies"
                    placeholder="availableCopies"
                    value={updatedData.availableCopies}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded-lg"
                  />
                </div>
                {errors.availableCopies && (
                  <p className="text-red-500 text-sm">
                    {errors.availableCopies}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center pt-10">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBook;
