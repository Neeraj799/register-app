import { createContext, useState } from "react";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const value = {
    userData,
    setUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
