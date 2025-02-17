import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, CircularProgress } from "@mui/material";
import { BookContext } from "../context/BookContext";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../config";
import { GlobalContext } from "../context/GlobalContext";

const Collection = () => {
  const {
    data,
    setData,
    page,
    setPage,
    totalPages,
    setTotalPages,
    searchQuery,
    setSearchQuery,
  } = useContext(BookContext);

  const { loading, setLoading } = useContext(GlobalContext);

  const { token } = useContext(AuthContext);

  const limit = 10;

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      navigate("/unauthorized");
    }
  }, [token]);

  useEffect(() => {
    if (!searchQuery) {
      fetchData();
    }
  }, [page]);

  const handleNextPage = () => {
    setLoading(true);
    setPage((prevPage) => prevPage + 1);
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:8080/book/books/?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data.data);

      setTotalPages(response.data.pagination.totalPages);
      setLoading(false);
    } catch (err) {
      setTimeout(false);
      toast.error(err.response?.data?.message || "Failed to fetch data", {
        position: "top-right",
      });
    }
  };

  const fetchSearchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/book/search?query=${searchQuery}`
      );

      setData(response.data.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Failed to fetch data", {
        position: "top-right",
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchQuery) {
      fetchSearchData();
    } else {
      fetchData();
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      if (!token) {
        navigate("/unauthorized");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/book/borrowBook/${bookId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Book borrowed successfully", {
        position: "top-right",
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to borrow book", {
        position: "top-right",
      });
    }
  };

  const handleReturn = async (bookId) => {
    try {
      if (!token) {
        navigate("/unauthorized");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/book/returnBook/${bookId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Book returned successfully", {
        position: "top-right",
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to return book", {
        position: "top-right",
      });
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center p-10 ">
        <div className="flex justify-center mb-10">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="p-2 border border-gray-300 rounded"
              placeholder="Search by title or author"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button
              type="submit"
              className="ml-2 p-2 bg-blue-500 text-white rounded"
            >
              Search
            </button>
          </form>
        </div>

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
        ) : (
          <div>
            {data.length > 0 ? (
              <div>
                <div className="flex flex-wrap gap-4 justify-center">
                  {data.map((book) => (
                    <div
                      key={book._id}
                      className="border border-black p-4 flex flex-col"
                    >
                      <div>{book?.title}</div>
                      <div>{book?.author}</div>
                      <div>{book?.ISBN}</div>
                      <div>{book?.publishedYear}</div>
                      <div>{book?.availableCopies}</div>
                      <div className="mt-4 flex gap-2">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-200"
                          onClick={() => handleBorrow(book._id)}
                          disabled={book?.availableCopies <= 0}
                        >
                          Borrow
                        </button>
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded"
                          onClick={() => handleReturn(book._id)}
                        >
                          Return
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-6 gap-4">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded disables: opacity-50"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 border border-gray-500 rounded">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="px-4 py-2 border border-gray-300 rounded disabled: opacity-50"
                    disabled={page === totalPages}
                    onClick={() => handleNextPage()}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div>No books found</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Collection;
