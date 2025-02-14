import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthContextProvider = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
};

useEffect(() => [
    const user = localStorage.getItem("user");

    if(user) {
        
    }
])