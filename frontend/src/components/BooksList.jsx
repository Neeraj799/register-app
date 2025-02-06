import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [updatedBook, setUpdatedBook] = useState({
    title: "",
    author: "",
    ISBN: "",
    publishedYear: "",
    availableCopies: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/book/allBooks`);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Failed to load books.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/unauthorized");
        return;
      }

      await axios.delete(`${BASE_URL}/book/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
      toast.success("Book deleted successfully.");
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Failed to delete book.");
    }
  };

  const handleEditClick = (book) => {
    setEditingBook(book._id);
    setUpdatedBook({
      title: book.title,
      author: book.author,
      ISBN: book.ISBN,
      publishedYear: book.publishedYear,
      availableCopies: book.availableCopies,
    });
  };

  const handleUpdateChange = (e) => {
    setUpdatedBook({ ...updatedBook, [e.target.name]: e.target.value });
  };

  const handleUpdateSave = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/unauthorized");
        return;
      }

      const response = await axios.patch(
        `${BASE_URL}/book/updateBook/${id}`,
        {
          title: updatedBook.title,
          author: updatedBook.author,
          ISBN: updatedBook.ISBN,
          publishedYear: updatedBook.publishedYear,
          availableCopies: updatedBook.availableCopies,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === id ? { ...book, ...response.data.submission } : book
        )
      );

      setEditingBook(null);
      toast.success("Book updated successfully.");
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("Failed to update book.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md mt-20">
      <h2 className="text-xl font-bold mb-4">Books List</h2>
      <ul>
        {books.length > 0 ? (
          books.map((book) => (
            <li
              key={book._id}
              className="flex justify-between items-center border-b py-2 gap-4"
            >
              {editingBook === book._id ? (
                <div className="flex flex-col gap-2 w-full">
                  <input
                    type="text"
                    name="title"
                    value={updatedBook.title}
                    onChange={handleUpdateChange}
                    className="border px-2 py-1 rounded w-full"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    name="author"
                    value={updatedBook.author}
                    onChange={handleUpdateChange}
                    className="border px-2 py-1 rounded w-full"
                    placeholder="Author"
                  />
                  <input
                    type="text"
                    name="ISBN"
                    value={updatedBook.ISBN}
                    onChange={handleUpdateChange}
                    className="border px-2 py-1 rounded w-full"
                    placeholder="ISBN"
                  />
                  <input
                    type="number"
                    name="publishedYear"
                    value={updatedBook.publishedYear}
                    onChange={handleUpdateChange}
                    className="border px-2 py-1 rounded w-full"
                    placeholder="Published Year"
                  />
                  <input
                    type="number"
                    name="availableCopies"
                    value={updatedBook.availableCopies}
                    onChange={handleUpdateChange}
                    className="border px-2 py-1 rounded w-full"
                    placeholder="Available Copies"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateSave(book._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingBook(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between w-full">
                  <span className="flex flex-col">
                    <strong className="text-lg text-gray-900">
                      {book.title}
                    </strong>
                    <span className="text-sm text-gray-600">
                      by{" "}
                      <span className="font-semibold text-blue-600">
                        {book.author}
                      </span>
                    </span>
                    <span className="text-xs text-gray-500">
                      <span className="font-medium">ISBN:</span> {book.ISBN} |
                      <span className="font-medium"> Year:</span>{" "}
                      {book.publishedYear} |
                      <span className="font-medium"> Copies:</span>{" "}
                      {book.availableCopies}
                    </span>
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(book)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))
        ) : (
          <p>No books available.</p>
        )}
      </ul>
    </div>
  );
};

export default BooksList;
