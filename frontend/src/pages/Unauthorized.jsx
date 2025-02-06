import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1>
      <p className="text-gray-600 mt-2">
        You do not have permission to view this page.
      </p>
      <Link
        to="/login"
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go to Login page
      </Link>
    </div>
  );
};

export default Unauthorized;
