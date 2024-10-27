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

  const startAudioCall = async (targetUserId) => {
    if (!callConn) {
      console.error("No call connection available.");
      return null;
    }

    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        callConn.invoke(
          "SendIceCandidate",
          targetUserId,
          JSON.stringify(event.candidate)
        );
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    await callConn.invoke("SendOffer", targetUserId, JSON.stringify(offer));

    return peerConnection;
  };

  const startVideoCall = async (targetUserId) => {
    if (!callConn) {
      console.error("No call connection available.");
      return null;
    }

    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        callConn.invoke(
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
    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    await callConn.invoke("SendOffer", targetUserId, JSON.stringify(offer));

    return peerConnection;
  };

  return (
    <CallConnContext.Provider
      value={{ callConn, connectCall, startAudioCall, startVideoCall }}
    >
      {children}
    </CallConnContext.Provider>
  );
};

export const useCallConn = () => {
  return useContext(CallConnContext);
};
