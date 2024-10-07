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

const dummyMessages = [
  {
    id: 1,
    message: {
      senderName: "test 1",
      senderAvatar: "image 1",
      text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae, adipisci aspernatur. Praesentium a delectus quibusdam quae beatae doloribus dolorum debitis accusantium sapiente illo laborum quaerat vero voluptatibus id, eum officiis.",
    },
    isFromYou: false,
  },
  {
    id: 2,
    message: {
      text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae, adipisci aspernatur. Praesentium a delectus quibusdam quae beatae doloribus dolorum debitis accusantium sapiente illo laborum quaerat vero voluptatibus id, eum officiis.",
    },
    isFromYou: true,
  },
  {
    id: 3,
    message: {
      senderName: "test 1",
      senderAvatar: "image 1",
      text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae, adipisci aspernatur. Praesentium a delectus quibusdam quae beatae doloribus dolorum debitis accusantium sapiente illo laborum quaerat vero voluptatibus id, eum officiis.",
    },
    isFromYou: false,
  },
];

export default function ChatBox({
  isOpen,
  handleCloseChat,
  avatar,
  isOnline,
  contactId,
  contactName,
  status,
}) {
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
        {dummyMessages.map((data) => (
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
