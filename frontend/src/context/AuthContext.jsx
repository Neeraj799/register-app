import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(parsedUser?.token);
        setIsAuthenticated(true);
      } catch (error) {
        console.log("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (userData, token) => {
    const userWithToken = { ...userData, token };
    localStorage.setItem("user", JSON.stringify(userWithToken));
    setUser(userWithToken);
    setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
