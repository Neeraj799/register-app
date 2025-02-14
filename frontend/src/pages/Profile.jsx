import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { BookContext } from "../context/BookContext";

const Profile = () => {
  const { books, setBooks, loading, setLoading, error, setError } =
    useContext(BookContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBorrowHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/unauthorized");
          return;
        }
        const response = await axios.get(
          "http://localhost:8080/book/borrowHistory/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBooks(response.data.books);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Borrow History</h2>

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
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : books.length === 0 ? (
        <p className="text-gray-500">No borrowing history found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Title</th>
              <th className="border border-gray-300 px-4 py-2">Author</th>
              <th className="border border-gray-300 px-4 py-2">ISBN</th>
              <th className="border border-gray-300 px-4 py-2">Borrowed At</th>
              <th className="border border-gray-300 px-4 py-2">Return At</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {book.title}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {book.author}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {book.ISBN}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {book.borrowedBy.length > 0
                    ? new Date(
                        book.borrowedBy[0].borrowedDate
                      ).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {book.borrowedBy.length > 0
                    ? new Date(
                        book.borrowedBy[0].returnDate
                      ).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Profile;
