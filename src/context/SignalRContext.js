// SignalRContext.js
import React, { createContext, useContext, useState } from "react";
import startConnection from "../services/chatService";

const SignalRContext = createContext();

export const SignalRProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);

  const connect = async (userId) => {
    const conn = await startConnection(userId);
    setConnection(conn);
  };

  return (
    <SignalRContext.Provider value={{ connection, connect }}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => {
  return useContext(SignalRContext);
};
