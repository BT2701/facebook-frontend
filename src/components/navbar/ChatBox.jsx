import { CloseIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  Box,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";

import { FiSend, FiSmile, FiPaperclip } from "react-icons/fi";
import ChatMessage from "./ChatMessage";
import { useEffect, useState } from "react";
import { getMessagesByUserIdAndContactId } from "../../utils/getData";

export default function ChatBox({
  isOpen,
  handleCloseChat,
  avatar,
  isOnline,
  contactId,
  contactName,
  status,
}) {
  const [messages, setMessages] = useState([]);

  const getMessages = async () => {
    const currentUser = 1;

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
    }
  };

  useEffect(() => {
    // If this component have contactId then get data from server
    if (contactId) {
      getMessages();
    }
  }, [contactId]);

  return (
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
            {isOnline === 1 && <AvatarBadge boxSize="1.25em" bg="green.500" />}
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

        <IconButton
          colorScheme=""
          icon={<CloseIcon />}
          onClick={handleCloseChat}
        />
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
        <IconButton icon={<FiSmile />} variant="ghost" aria-label="Add emoji" />

        {/* Input Field */}
        <Input
          variant="unstyled"
          placeholder="Type a message..."
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
        />
      </Box>
      {/* End Chat Input */}
    </Box>
  );
}
