import { CloseIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  Box,
  HStack,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";

import { AiOutlinePhone } from "react-icons/ai";
import { IoVideocamOutline } from "react-icons/io5";

import { FiSend, FiSmile, FiPaperclip } from "react-icons/fi";
import ChatMessage from "./ChatMessage";
import { useEffect, useRef, useState } from "react";
import { getMessagesByUserIdAndContactId } from "../../utils/getData";
import axios from "axios";
import { useChatConn } from "../../context/ChatConnContext";
import { useChatBox } from "../../context/ChatBoxContext";
import { useUser } from "../../context/UserContext";
import { useCallConn } from "../../context/CallConnContext";
import CallUI from "./CallUI";

export default function ChatBox() {
  const {
    chatInfo: { isOpen, avatar, isOnline, contactId, contactName, status },
    setChatInfo,
  } = useChatBox();

  const { chatConn } = useChatConn();
  const { callConn, startAudioCall, startVideoCall } = useCallConn();
  const { currentUser } = useUser();

  // Ref
  const contactIdRef = useRef(contactId);
  const contactNameRef = useRef(contactName);
  const avatarRef = useRef(avatar);

  // State for all messages
  const [messages, setMessages] = useState([]);

  // State for message input
  const [msgInput, setMsgInput] = useState("");

  // State for calling
  const [isCalling, setIsCalling] = useState(false);

  // Add message to db
  const postMsg = async (msg) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/message`,
        msg,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handle send message
  const handleSendMsg = async () => {
    if (msgInput) {
      try {
        // Add message to database
        const response = await postMsg({
          Sender: currentUser,
          Receiver: contactId,
          CreatedAt: new Date().toISOString().split(".")[0],
          Content: msgInput,
        });

        if (response && response.data && response.data.id) {
          // Update messages
          setMessages((prev) => [
            ...prev,
            {
              id: response.data.id,
              message: { text: msgInput },
              isFromYou: true,
            },
          ]);

          // Send message to Signal R
          await chatConn.invoke(
            "SendMessage",
            response.data.id,
            currentUser,
            contactId,
            msgInput
          );
          console.log("Message sent!");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
      setMsgInput(""); // Reset message input
    }
  };

  // Handle audio call
  const handleAudioCall = async () => {
    setIsCalling(true);
    // const peer = await startAudioCall(contactId);
    // if (peer) {
    //   console.log("Audio call started successfully");
    //   // Handle successful audio call (e.g., update UI, etc.)
    // } else {
    //   console.error("Failed to start audio call");
    //   setIsCalling(false);
    // }
  };

  // Handle video call
  const handleVideoCall = async () => {
    setIsCalling(true);
    // const peer = await startVideoCall(contactId);
    // if (peer) {
    //   console.log("Video call started successfully");
    //   // Handle successful video call (e.g., update UI, etc.)
    // } else {
    //   console.error("Failed to start video call");
    //   setIsCalling(false);
    // }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMsg();
    }
  };

  // Get messages from server
  const getMessages = async () => {
    const response = await getMessagesByUserIdAndContactId(
      currentUser,
      contactId
    );

    if (response && response.data) {
      const tempMsg = [];

      for (const msg of response.data) {
        // if sender is current user
        if (msg.sender === currentUser) {
          tempMsg.push({
            id: msg.id,
            message: { text: msg.content },
            isFromYou: true,
          });
        } else {
          tempMsg.push({
            id: msg.id,
            message: {
              senderName: contactName,
              senderAvatar: avatar,
              text: msg.content,
            },
            isFromYou: false,
          });
        }
      }

      setMessages(tempMsg);
    } else {
      setMessages([]);
    }
  };

  // useEffect for chat connection
  useEffect(() => {
    const listenFromServer = (msgId, fromId, message) => {
      if (fromId === contactIdRef.current) {
        // Set incoming message
        setMessages((prev) => [
          ...prev,
          {
            id: msgId,
            message: {
              senderName: contactNameRef.current,
              senderAvatar: avatarRef.current,
              text: message,
            },
            isFromYou: false,
          },
        ]);
      }
    };
    // Listening from server
    if (chatConn) {
      chatConn.on("ReceiveMessage", listenFromServer);
    }

    // component unmount
    return () => {
      if (chatConn) {
        console.log("Off listener chat message");
        chatConn.off("ReceiveMessage");
      }
    };
  }, [chatConn]);

  // Use effect for call connection
  // useEffect(() => {
  //   if (callConn) {
  //     // Lắng nghe khi có yêu cầu gọi đến
  //     callConn.on("ReceiveCallRequest", async (fromUserId, callType) => {
  //       // callType có thể là 'audio' hoặc 'video' tùy thuộc vào loại cuộc gọi
  //       if (callType === "audio") {
  //         // Xử lý yêu cầu cuộc gọi âm thanh
  //         handleIncomingAudioCall(fromUserId);
  //       } else if (callType === "video") {
  //         // Xử lý yêu cầu cuộc gọi video
  //         handleIncomingVideoCall(fromUserId);
  //       }
  //     });
  //   }

  //   // component unmount
  //   return () => {
  //     if (callConn) {
  //       console.log("Off listener call");
  //       callConn.off("ReceiveCallRequest");
  //     }
  //   };
  // }, [callConn]);

  useEffect(() => {
    // If this component have contactId then get data from server
    if (contactId) {
      contactIdRef.current = contactId;
      contactNameRef.current = contactName;
      avatarRef.current = avatar;
      // Get messages between user and contacter
      getMessages();
    }
  }, [contactId]);

  return (
    <>
      {isCalling ? (
        <CallUI
          userAvatar={avatar}
          userName={contactName}
          onCancelCall={() => setIsCalling(false)}
        />
      ) : (
        <Box
          w="338px"
          h="450px"
          display={isOpen ? "flex" : "none"}
          flexDirection="column"
          position="fixed"
          bgColor="gray.300"
          right={2}
          bottom={0}
          borderTopRadius={10}
          zIndex={1}
        >
          {/* Chat header */}
          <Box
            display="flex"
            justifyContent="space-between"
            p={2}
            bgColor="#1877F2"
            borderTopRadius={10}
          >
            <Box display="flex" alignItems="center">
              <Avatar size="sm" ml={1} src={avatar} name={contactName}>
                {isOnline === 1 && (
                  <AvatarBadge boxSize="1.25em" bg="green.500" />
                )}
              </Avatar>

              <Box ml={5}>
                <Text as="b" fontSize="lg" display="block" mb="-5px">
                  {contactName}
                </Text>
                <Text fontSize="sm" opacity="85%" mb={0}>
                  {status}
                </Text>
              </Box>
            </Box>

            <HStack spacing={1}>
              <IconButton
                aria-label="Audio Call"
                colorScheme=""
                icon={<AiOutlinePhone />}
                onClick={handleAudioCall}
              />
              <IconButton
                aria-label="Video Call"
                colorScheme=""
                icon={<IoVideocamOutline />}
                onClick={handleVideoCall}
              />
              <IconButton
                aria-label="Close button"
                colorScheme=""
                icon={<CloseIcon />}
                onClick={() => {
                  setChatInfo((prev) => ({ ...prev, isOpen: false }));
                }}
              />
            </HStack>
          </Box>
          {/* End Chat Header */}

          {/* Chat Message */}
          <Box overflowY="auto" flex={1} p={2}>
            {messages.map((data) => (
              <ChatMessage
                key={data.id}
                message={data.message}
                isFromYou={data.isFromYou}
              />
            ))}
          </Box>
          {/* End Chat Message */}

          {/* Chat Input */}
          <Box
            display="flex"
            alignItems="center"
            bg="gray.100"
            p={2}
            borderRadius="md"
            boxShadow="sm"
          >
            {/* Attachments */}
            <IconButton
              icon={<FiPaperclip />}
              variant="ghost"
              aria-label="Attach file"
            />

            {/* Emoji Icon */}
            <IconButton
              icon={<FiSmile />}
              variant="ghost"
              aria-label="Add emoji"
            />

            {/* Input Field */}
            <Input
              variant="unstyled"
              placeholder="Type a message..."
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              onKeyDown={handleKeyDown}
              size="md"
              borderRadius="none"
              flex={1}
              mx={2}
            />

            {/* Send Button */}
            <IconButton
              icon={<FiSend />}
              colorScheme="blue"
              variant="ghost"
              aria-label="Send message"
              onClick={handleSendMsg}
            />
          </Box>
          {/* End Chat Input */}
        </Box>
      )}
    </>
  );
}
