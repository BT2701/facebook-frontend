import { ChatIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  Box,
  Center,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import ChatBox from "./ChatBox";

export default function ChatMenu() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      let currentUser = 1;

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/message/UserMessages/${currentUser}/latest`
        );

        console.log(response.data);

        let messageArray = [];
        for (const msg of response.data) {
          // Create obj msg
          let message = { id: msg.id };

          if (msg.sender === currentUser && msg.receiver) {
            // Fetch receiver data by msg.receiver
            let data = {
              name: msg.receiver,
              avatar: "avatar",
              isOnline: 1,
            };
            message.contactName = data.name;
            message.avatar = data.avatar;
            message.isOnline = data.isOnline;

            message.content = `You: ${msg.content}`;
          } else if (msg.receiver === currentUser && msg.sender) {
            // Fetch receiver data by msg.receiver
            let data = {
              name: msg.sender,
              avatar: "avatar",
              isOnline: 1,
            };
            message.contactName = data.name;
            message.avatar = data.avatar;
            message.isOnline = data.isOnline;

            message.content = msg.content;
          }

          //   Add message to array
          messageArray.push(message);
        }

        setMessages(messageArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <>
      {/* Chat Box */}
      <ChatBox isOpen={isChatOpen} handleCloseChat={handleCloseChat} />

      <Center mr={4}>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<ChatIcon />}
            rounded="full"
            position="relative"
          />
          <MenuList
            w="360px"
            maxHeight="93vh"
            boxShadow="2xl"
            p={4}
            overflowY="auto"
            position="absolute"
            left="-260px"
          >
            <Heading as="h2" mb={3}>
              Chat
            </Heading>
            <VStack gap={2}>
              {messages.map((msg) => (
                <MenuItem
                  key={msg.id}
                  borderRadius={10}
                  p={3}
                  onClick={handleOpenChat}
                >
                  <Avatar mr={5} src={msg.avatar}>
                    {msg.isOnline === 1 && (
                      <AvatarBadge boxSize="1.25em" bg="green.500" />
                    )}
                  </Avatar>
                  <Box>
                    <Text fontSize="lg" mb={0}>
                      {msg.contactName}
                    </Text>
                    <Text fontSize="sm" mb={0} noOfLines={1} opacity="85%">
                      {msg.content}
                    </Text>
                  </Box>
                </MenuItem>
              ))}
            </VStack>
          </MenuList>
        </Menu>
      </Center>
    </>
  );
}
