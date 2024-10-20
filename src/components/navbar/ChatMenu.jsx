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
import { getMessagesByUserId, getUserById } from "../../utils/getData";
import { useChatBox } from "../../context/ChatBoxContext";

export default function ChatMenu() {
  const { setChatInfo } = useChatBox();

  const [messages, setMessages] = useState([]);

  const handleOpenChat = (avatar, isOnline, contactId, contactName, status) => {
    setChatInfo({
      isOpen: true,
      avatar,
      isOnline,
      contactId,
      contactName,
      status,
    });
  };

  const getDataForChatMenu = async () => {
    let currentUser = 1;

    const response = await getMessagesByUserId(currentUser);

    if (response && response.data) {
      const messageArray = [];
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
            contactId: userId,
            contactName: userData.data.name,
            avatar: userData.data.avatar,
            isOnline: userData.data.isOnline,
            content,
          });
        }
      }

      setMessages(messageArray);
    }
  };

  useEffect(() => {
    getDataForChatMenu();
  }, []);

  return (
    <>
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
                  onClick={() =>
                    handleOpenChat(
                      msg.avatar,
                      msg.isOnline,
                      msg.contactId,
                      msg.contactName,
                      "Active"
                    )
                  }
                >
                  <Avatar mr={5} src={msg.avatar} name={msg.contactName}>
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
