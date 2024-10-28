import React, { useEffect, useRef, useState } from "react";
import { Box, VStack, Text, Avatar, IconButton } from "@chakra-ui/react";
import { FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from "react-icons/fa";
import { useCallConn } from "../../context/CallConnContext";
import WaitingCallUI from "./WaitingCallUI";
import { useUser } from "../../context/UserContext";

export default function CallScreen({
  isVideoCall,
  userAvatar,
  userName,
  onCancelCall,
}) {
  // State for waiting call
  const [isWaitingCall, setIsWaitingCall] = useState(true);

  const { startAudioCall, startVideoCall } = useCallConn();
  const { currentUser } = useUser();

  const [isMuted, setIsMuted] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  };

  useEffect(() => {
    console.log("Call screen mounted");
    const startCall = async () => {
      try {
        // const peerConnection = isVideoCall
        //   ? await startVideoCall(currentUser)
        //   : await startAudioCall(currentUser);
        // setupStream(peerConnection);

        setIsWaitingCall(false);
      } catch (error) {
        console.error("Error calling " + error);
      }
    };

    const setupStream = (peerConnection) => {
      peerConnection.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };
    };

    startCall();

    return () => {
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    };
  }, [isVideoCall]);

  return isWaitingCall ? (
    <WaitingCallUI
      userAvatar={userAvatar}
      userName={userName}
      onCancelCall={onCancelCall}
    />
  ) : (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      h="100vh"
      w="100vw"
      bg="gray.100"
      pos="fixed"
      left={0}
      top={0}
      zIndex="overlay"
    >
      <VStack spacing={4}>
        {isVideoCall ? (
          <Box
            position="relative"
            width="100%"
            w="100vw"
            h="80vh"
            bg="gray.900"
            borderRadius="md"
            overflow="hidden"
          >
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{
                background: "white",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              style={{
                background: "black",
                width: "150px",
                height: "100px",
                position: "absolute",
                bottom: "10px",
                right: "10px",
                borderRadius: "md",
                objectFit: "cover",
              }}
            />
          </Box>
        ) : (
          <VStack align="center" spacing={3}>
            <Avatar size="2xl" name={userName} src={userAvatar} />
            <Text fontSize="xl">Calling {isVideoCall ? "Video" : "Audio"}</Text>
          </VStack>
        )}

        <Box display="flex" gap={4}>
          <IconButton
            icon={isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            onClick={toggleMute}
            colorScheme={isMuted ? "red" : "blue"}
            aria-label="Toggle Mute"
          />
          <IconButton
            icon={<FaPhoneSlash />}
            onClick={onCancelCall}
            colorScheme="red"
            aria-label="End Call"
          />
        </Box>
      </VStack>
    </Box>
  );
}
