import * as signalR from "@microsoft/signalr";

// Create connection with current userId
const connection = (userId) =>
  new signalR.HubConnectionBuilder()
    .withUrl(`http://localhost:8002/callhub?userId=${userId}`)
    .withAutomaticReconnect()
    .build();

const startCallConnection = async (userId) => {
  try {
    const conn = connection(userId);
    await conn.start();
    console.log("Connect call service successfully!");
    return conn;
  } catch (err) {
    console.error("Cannot connect call service:", err);
    setTimeout(() => startCallConnection(userId), 5000);
    return null;
  }
};

// Export startCallConnection
export default startCallConnection;
