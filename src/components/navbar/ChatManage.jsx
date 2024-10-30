import { useEffect, useRef, useState } from "react";
import ChatBox from "./ChatBox";
import Peer from "simple-peer";
import { getUserById } from "../../utils/getData";
import { useUser } from "../../context/UserContext";
import { useChatConn } from "../../context/ChatConnContext";
import { useChatBox } from "../../context/ChatBoxContext";
import CallScreen from "../callScreen/CallScreen";
import IncomingCallScreen from "../callScreen/IncomingCallScreen";
import WaitingCallScreen from "../callScreen/WaitingCallScreen";

export default function ChatManage() {
  const {
    chatInfo: { isOpen, contactId, contactName, avatar },
  } = useChatBox();

  const { chatConn } = useChatConn();
  const { currentUser } = useUser();

  // Ref
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const connectionRef = useRef(null);

  // State for the caller call to this
  const [caller, setCaller] = useState(null);
  const [callerSignal, setCallerSignal] = useState(null);
  const [callerName, setCallerName] = useState(null);
  const [callerAvatar, setCallerAvatar] = useState(null);

  const [stream, setStream] = useState(null);

  // State for waiting call
  const [isWaiting, setIsWaiting] = useState(false);

  // State for call screen
  const [isCalling, setIsCalling] = useState(false);

  // State for incoming call
  const [isIncomingCall, setIsIncomingCall] = useState(false);

  // State for accepting incoming call
  const [callAccepted, setCallAccepted] = useState(false);

  // Track if it's a video call
  const [isVideoCall, setIsVideoCall] = useState(false);

  const leaveCall = () => {
    setIsWaiting(false);
    setIsIncomingCall(false);
    setCallAccepted(false);
    setIsCalling(false);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop()); // Stop all tracks of the current stream
      setStream(null);
    }
    try {
      if (connectionRef.current) {
        connectionRef.current.destroy();
        connectionRef.current = null;
      }
    } catch (error) {
      console.error("Error during peer connection destruction:", error);
    }
  };

  useEffect(() => {
    if (chatConn) {
      // Listening to receive a call
      chatConn.on("ReceiveCall", (data) => {
        setIsIncomingCall(true);
        // Set info of the person who calls to this
        setCallerSignal(data.signalData);
        setCaller(data.fromUserId);
        setCallerName(data.userName);
        setCallerAvatar(data.userAvt);
        setIsVideoCall(data.isVideoCall);
      });

      return () => {
        console.log("Off listener receive call");
        chatConn.off("ReceiveCall");
      };
    }
  }, [chatConn]);

  useEffect(() => {
    // If user is waiting for a call then getMedia to ready call
    if (isWaiting || callAccepted) {
      navigator.mediaDevices
        .getUserMedia({ video: isVideoCall, audio: true })
        .then((stream) => {
          setStream(stream);
        })
        .catch((error) => {
          console.error("Error accessing media devices.", error);
        });
    }
  }, [isWaiting, callAccepted, isVideoCall]);

  useEffect(() => {
    if (stream && (isCalling || callAccepted)) {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    }
  }, [stream, isCalling, callAccepted, localVideoRef]);

  useEffect(() => {
    if (stream && isWaiting) {
      const callUser = async (callToUserId) => {
        // Get user data by user id
        const userData = await getUserById(currentUser);

        let userName = "",
          userAvatar = "";
        //   Get current user name and avatar
        if (userData && userData.data) {
          userName = userData.data.name;
          userAvatar = userData.data.avt;
        }

        const peer = new Peer({
          initiator: true,
          trickle: false,
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
              { urls: "stun:stun2.l.google.com:19302" },
            ],
          },
          stream: stream,
        });
        peer.on("signal", async (data) => {
          try {
            if (chatConn) {
              await chatConn.invoke(
                "CallUser",
                currentUser,
                userName,
                userAvatar,
                callToUserId,
                JSON.stringify(data),
                isVideoCall
              );
            } else {
              console.log("Cannot connect to call service");
            }
          } catch (error) {
            console.error("Error when call user " + error);
          }
        });
        peer.on("stream", (stream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
            console.log("Remote stream received", stream);
          }
        });
        if (chatConn) {
          chatConn.on("CallAccepted", (signal) => {
            peer.signal(JSON.parse(signal));
            setIsWaiting(false);
            setIsCalling(true);
          });
        } else {
          console.log("Cannot connect to call service");
        }

        connectionRef.current = peer;
      };

      callUser(contactId);
    }
  }, [stream, isWaiting]);

  useEffect(() => {
    if (stream && callAccepted) {
      const answerCall = () => {
        const peer = new Peer({
          initiator: false,
          trickle: false,
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
              { urls: "stun:stun2.l.google.com:19302" },
            ],
          },
          stream: stream,
        });
        peer.on("signal", async (data) => {
          try {
            if (chatConn) {
              await chatConn.invoke("AnswerCall", caller, JSON.stringify(data));
            } else {
              console.log("Cannot connect to call service");
            }
          } catch (error) {
            console.error("Error when answering call " + error);
          }
        });
        peer.on("stream", (stream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
            console.log("Remote stream received", stream);
          }
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
      };

      answerCall();
    }
  }, [stream, callAccepted]);

  //   If chat box is open and not calling then show chat box
  if (isOpen && !isCalling && !isIncomingCall && !isWaiting) {
    return (
      <ChatBox
        onCallAudio={() => {
          setIsVideoCall(false);
          setIsWaiting(true);
        }}
        onCallVideo={() => {
          setIsVideoCall(true);
          setIsWaiting(true);
        }}
      />
    );
  }

  // If the user is wating for call
  else if (isWaiting) {
    return (
      <WaitingCallScreen
        userAvatar={avatar}
        userName={contactName}
        onCancelCall={() => leaveCall()}
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
        stream={stream}
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        onCancelCall={() => leaveCall()}
      />
    );
  }

  //   If user receive a call
  else if (isIncomingCall) {
    // If they accept the receiving call
    if (callAccepted) {
      return (
        <CallScreen
          isVideoCall={isVideoCall}
          userAvatar={callerAvatar}
          userName={callerName}
          stream={stream}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          onCancelCall={() => leaveCall()}
        />
      );
    }

    return (
      <IncomingCallScreen
        userAvatar={callerAvatar}
        userName={callerName}
        onAccept={() => {
          setCallAccepted(true);
        }}
        onDecline={() => leaveCall()}
      />
    );
  }
}
