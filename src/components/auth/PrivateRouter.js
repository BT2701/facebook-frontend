import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const PrivateRoute = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionInfo = async () => {
      try {
        const sessionResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/sessionInfo`,
          { withCredentials: true }
        );
        setUserId(sessionResponse.data.userId);
      } catch (error) {
        console.error("Error fetching session info:", error);
        setUserId(null);
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

  return userId ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
