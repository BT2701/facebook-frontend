import React, { createContext, useContext, useState } from "react";
import startCallConnection from "../services/callService";

const CallConnContext = createContext();

export const CallConnProvider = ({ children }) => {
  const [callConn, setCallConn] = useState(null);

  const connectCall = async (userId) => {
    if (!callConn) {
      const conn = await startCallConnection(userId);
      setCallConn(conn);
    }
  };

  return (
    <CallConnContext.Provider value={{ callConn, connectCall }}>
      {children}
    </CallConnContext.Provider>
  );
};

export const useCallConn = () => {
  return useContext(CallConnContext);
};
