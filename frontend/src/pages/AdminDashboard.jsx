import React from "react";
import CreateBook from "../components/CreateBook";
import BooksList from "../components/BooksList";

const AdminDashboard = () => {
  return (
    <div>
      <CreateBook />
      <BooksList />
    </div>
  );
};

export default AdminDashboard;
