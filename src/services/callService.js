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
    console.log("Kết nối CallService thành công!");
    return conn;
  } catch (err) {
    console.error("Kết nối CallService thất bại:", err);
    setTimeout(() => startCallConnection(userId), 5000);
    return null;
  }
};

export const startAudioCall = async (connection, targetUserId) => {
  const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      connection.invoke(
        "SendIceCandidate",
        targetUserId,
        JSON.stringify(event.candidate)
      );
    }
  };

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  await connection.invoke("SendOffer", targetUserId, JSON.stringify(offer));

  return peerConnection;
};

export const startVideoCall = async (connection, targetUserId) => {
  const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      connection.invoke(
        "SendIceCandidate",
        targetUserId,
        JSON.stringify(event.candidate)
      );
    }
  };

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  await connection.invoke("SendOffer", targetUserId, JSON.stringify(offer));

  return peerConnection;
};

// Export startCallConnection
export default startCallConnection;
