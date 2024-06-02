import React, { createContext, useState } from "react";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [admin, setAdmin] = useState(true);

  const changeRole = () => {
    setAdmin((prevAdmin) => !prevAdmin);
  };

  return (
    <UserContext.Provider value={{ admin, changeRole }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
