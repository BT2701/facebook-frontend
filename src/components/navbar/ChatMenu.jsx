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
import ChatBox from "./ChatBox";
import { getMessagesByUserId, getUserById } from "../../utils/getData";

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
    let currentUser = 1;

    getMessagesByUserId(currentUser).then(async (response) => {
      if (!!response.data) {
        let messageArray = [];
        let userId, content;
        for (const msg of response.data) {
          if (msg.sender === currentUser && msg.receiver) {
            // User id not currentUser
            userId = msg.receiver;
            // Content of the message
            content = `You: ${msg.content}`;
          } else if (msg.receiver === currentUser && msg.sender) {
            // User id not currentUser
            userId = msg.sender;
            // Content of the message
            content = msg.content;
          }

          // Get user data by user id
          let userData = await getUserById(userId);

          //   Add message to array
          if (!!userData.data) {
            messageArray.push({
              id: msg.id,
              contactName: userData.data.name,
              avatar: userData.data.avatar,
              isOnline: userData.data.isOnline,
              content,
            });
          }
        }

        setMessages(messageArray);
      }
    });
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
