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

  const startCall = async (targetUserId, isVideoCall = false) => {
    if (!callConn) {
      console.error("No call connection available.");
      return null;
    }

    try {
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

      // Request media stream based on the call type
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: isVideoCall, // Set video option based on the parameter
      });

      mediaStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, mediaStream));

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      await callConn.invoke("SendOffer", targetUserId, JSON.stringify(offer));

      return peerConnection;
    } catch (err) {
      console.error(
        `Error ${isVideoCall ? "starting video" : "audio"} call: ` + err
      );
      return null;
    }
  };

  const startAudioCall = (targetUserId) => startCall(targetUserId, false);
  const startVideoCall = (targetUserId) => startCall(targetUserId, true);

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
