import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import BookContext from "./context/BookContext.jsx";
import UserContext from "./context/UserContext.jsx";
import AuthContext from "./context/AuthContext.jsx";
import GlobalContext from "./context/GlobalContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContext>
      <GlobalContext>
        <BookContext>
          <UserContext>
            <App />
          </UserContext>
        </BookContext>
      </GlobalContext>
    </AuthContext>
  </BrowserRouter>
);
