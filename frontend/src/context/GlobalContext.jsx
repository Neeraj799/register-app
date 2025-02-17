import { createContext, useState } from "react";

export const GlobalContext = createContext();

const GlobalContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState();

  const [errors, setErrors] = useState({});

  const [refresh, setRefresh] = useState(false);

  const value = {
    loading,
    setLoading,
    error,
    setError,
    errors,
    setErrors,
    refresh,
    setRefresh,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
