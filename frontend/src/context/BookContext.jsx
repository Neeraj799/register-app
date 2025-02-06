import { createContext, useState } from "react";

export const BookContext = createContext();

const BookContextProvider = (props) => {
  const value = {};

  return (
    <BookContext.Provider value={value}>{props.children}</BookContext.Provider>
  );
};

export default BookContextProvider;
