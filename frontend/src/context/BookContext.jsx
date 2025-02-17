import { createContext, useState } from "react";

export const BookContext = createContext();

const BookContextProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const value = {
    data,
    setData,
    userData,
    setUserData,
    books,
    setBooks,
    page,
    setPage,
    totalPages,
    setTotalPages,
    searchQuery,
    setSearchQuery,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export default BookContextProvider;
