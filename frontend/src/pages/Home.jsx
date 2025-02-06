import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const limit = 10;

  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery) {
      fetchData();
    }
  }, [page]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/unauthorized");
        return;
      }
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
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch data", {
        position: "top-right",
      });
    }
  };

  const fetchSearchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/book/search?query=${searchQuery}`
      );

      setData(response.data.data);
    } catch (err) {
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
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/unauthorized");
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/book/borrowBook/${bookId}`,
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
      fetchData(); // Refresh the book list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to borrow book", {
        position: "top-right",
      });
    }
  };

  const handleReturn = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/unauthorized");
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/book/return/${bookId}`,
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
      fetchData(); // Refresh the book list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to return book", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="p-10">
      <div className="flex justify-center mb-4">
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

      {data.length > 0 ? (
        <div>
          <div className="flex flex-wrap gap-4 p-10">
            {data.map((book) => (
              <div
                key={book._id}
                className="border border-black p-4 w-64 flex flex-col"
              >
                <div>{book?.title}</div>
                <div>{book?.author}</div>
                <div>{book?.ISBN}</div>
                <div>{book?.publishedYear}</div>
                <div>{book?.availableCopies}</div>
                <div className="mt-4 flex gap-2">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => handleBorrow(book._id)}
                    disabled={book?.availableCopies <= 0}
                  >
                    Borrow
                  </button>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={() => handleReturn(book._id)}
                    disabled={book?.availableCopies > 0}
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
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div>No products found</div>
      )}
    </div>
  );
};

export default Home;
