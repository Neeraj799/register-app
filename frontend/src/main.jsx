import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import BookContext from "./context/BookContext.jsx";
import UserContext from "./context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <BookContext>
      <UserContext>
        <App />
      </UserContext>
    </BookContext>
  </BrowserRouter>
);
