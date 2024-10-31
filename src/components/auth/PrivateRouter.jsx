import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";

import React from "react";

export default function PrivateRoute() {
  const { currentUser, setCurrentUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionInfo = async () => {
      try {
        const sessionResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/sessionInfo`,
          { withCredentials: true }
        );

        const userId = parseInt(sessionResponse.data.userId);
        setCurrentUser(userId);
      } catch (error) {
        console.error("Error fetching session info:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionInfo();
  }, []);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#555",
          animation: "fade 1.5s infinite",
        }}
      >
        Loading...
      </div>
    );

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
}
