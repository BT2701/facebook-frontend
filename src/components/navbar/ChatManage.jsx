import { useEffect, useRef, useState } from "react";
import { useChatBox } from "../../context/ChatBoxContext";
import { useCallConn } from "../../context/CallConnContext";
import CallScreen from "../callScreen/CallScreen";
import IncomingCallScreen from "../callScreen/IncomingCallScreen";
import ChatBox from "./ChatBox";

export default function ChatManage() {
  const {
    chatInfo: { isOpen, contactId, contactName, avatar },
  } = useChatBox();

  const { callConn } = useCallConn();

  // Ref
  const contactIdRef = useRef(contactId);

  // State for call screen
  const [isCalling, setIsCalling] = useState(false);

  // State for incoming call
  const [isIncomingCall, setIsIncomingCall] = useState(false);

  // Track if it's a video call
  const [isVideoCall, setIsVideoCall] = useState(false);

  useEffect(() => {
    if (contactId) {
      contactIdRef.current = contactId;
    }
  }, [contactId]);

  // Use effect for call connection
  //   useEffect(() => {
  //     if (callConn) {
  //       // Create a peer connection using stun google
  //       const peerConnection = new RTCPeerConnection({
  //         iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  //       });

  //       const handleReceiveOffer = async (offer) => {
  //         await peerConnection.setRemoteDescription(
  //           new RTCSessionDescription(JSON.parse(offer))
  //         );
  //         const answer = await peerConnection.createAnswer();
  //         await peerConnection.setLocalDescription(answer);

  //         callConn.invoke(
  //           "SendAnswer",
  //           contactIdRef.current,
  //           JSON.stringify(answer)
  //         );
  //       };

  //       const handleReceiveAnswer = async (answer) => {
  //         await peerConnection.setRemoteDescription(
  //           new RTCSessionDescription(JSON.parse(answer))
  //         );
  //       };

  //       // Listening on for acceting offer
  //       callConn.on("ReceiveOffer", handleReceiveOffer);

  //       // Listening on receiving answer
  //       callConn.on("ReceiveAnswer", handleReceiveAnswer);

  //       // component unmount
  //       return () => {
  //         if (callConn) {
  //           console.log("Off listener call");
  //           callConn.off("ReceiveOffer", handleReceiveOffer);
  //           callConn.off("ReceiveAnswer", handleReceiveAnswer);
  //         }
  //       };
  //     }
  //   }, [callConn]);

  //   If chat box is open and not calling then show chat box
  if (isOpen && !isCalling && !isIncomingCall) {
    return (
      <ChatBox
        onCallAudio={() => {
          setIsCalling(true);
          setIsVideoCall(false);
        }}
        onCallVideo={() => {
          setIsCalling(true);
          setIsVideoCall(true);
        }}
      />
    );
  }

  //   If user make a call
  else if (isCalling) {
    return (
      <CallScreen
        isVideoCall={isVideoCall}
        userAvatar={avatar}
        userName={contactName}
        onCancelCall={() => setIsCalling(false)}
      />
    );
  }

  //   If user receive a call
  else if (isIncomingCall) {
    return (
      <IncomingCallScreen
        userAvatar={avatar}
        userName={contactName}
        onDecline={() => {
          setIsIncomingCall(false);
        }}
      />
    );
  }
}
