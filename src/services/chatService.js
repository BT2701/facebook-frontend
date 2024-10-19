import * as signalR from "@microsoft/signalr";

// Create connection frome API Gateway
const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:8002/chathub")
  .withAutomaticReconnect()
  .build();

// Start connection
export const startConnection = async () => {
  try {
    await connection.start();
    console.log("Kết nối thành công!");
  } catch (err) {
    console.error("Kết nối thất bại:", err);
    setTimeout(startConnection, 5000);
  }
};

// Export connection
export default connection;
