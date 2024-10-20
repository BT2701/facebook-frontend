import {
  Avatar,
  AvatarBadge,
  Box,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import ChatBox from "../navbar/ChatBox";
import { useChatBox } from "../../context/ChatBoxContext";

const friends = [
  {
    id: 1,
    name: "Phan Duy",
    avatar: "https://via.placeholder.com/50",
    isOnline: 1,
  },
  {
    id: 2,
    name: "Ben Nguyen",
    avatar: "https://via.placeholder.com/50",
    isOnline: 1,
  },
  {
    id: 3,
    name: "Khuyen Huynh",
    avatar: "https://via.placeholder.com/50",
    isOnline: 1,
  },
  {
    id: 4,
    name: "Hoàng Thiện",
    avatar: "https://via.placeholder.com/50",
    isOnline: 1,
  },
  {
    id: 5,
    name: "To Thuong Kim",
    avatar: "https://via.placeholder.com/50",
    isOnline: 1,
  },
  {
    id: 6,
    name: "Nguyet Minh Phan",
    avatar: "https://via.placeholder.com/50",
    isOnline: 0,
  },
  {
    id: 7,
    name: "Tri Tran",
    avatar: "https://via.placeholder.com/50",
    isOnline: 1,
  },
];

export default function FriendList() {
  const { setChatInfo } = useChatBox();

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

  return (
    <>
      <ChatBox />

      <Box h="100vh" overflowY="auto" p={4} borderRadius="md" w="300px">
        <Stack>
          {friends.map((friend) => (
            <HStack
              key={friend.id}
              spacing={4}
              _hover={{ bg: "gray.300", cursor: "pointer", borderRadius: "md" }}
              p={2}
              onClick={() =>
                handleOpenChat(
                  friend.avatar,
                  friend.isOnline,
                  friend.id,
                  friend.name,
                  "active"
                )
              }
            >
              <Avatar size="sm" src={friend.avatar} name={friend.name}>
                {friend.isOnline === 1 && (
                  <AvatarBadge boxSize="1.25em" bg="green.500" />
                )}
              </Avatar>
              <Text fontWeight="medium" mb={0}>
                {friend.name}
              </Text>
            </HStack>
          ))}
        </Stack>
      </Box>
    </>
  );
}
