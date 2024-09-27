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
  TagLabel,
  Text,
  VStack,
  Tag,
} from "@chakra-ui/react";
import {
  ArrowForwardIcon,
  ChatIcon,
  MoonIcon,
  QuestionIcon,
  SettingsIcon,
  TriangleDownIcon,
} from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useState } from "react";
import ChatBox from "./ChatBox";
import Notifications from "../notification/Notification";

const Item = ({ iconName, title }) => {
  return (
    <MenuItem icon={iconName}>
      <Text fontWeight={500}>{title}</Text>
    </MenuItem>
  );
};

export const Option = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      {/* Chat Box */}
      <ChatBox isOpen={isChatOpen} handleCloseChat={handleCloseChat} />

      {/* Profile Avatar */}
      <Center mr={4}>
        <Link to={"/profile"}>
          <Tag
            size="lg"
            colorScheme="white"
            borderRadius="full"
            _hover={{ bg: "#f0f2f5" }}
            h={10}
          >
            <Avatar
              size="sm"
              name={`${"firstName"} ${"lastName"}`}
              ml={-1}
              mr={2}
              src={`uploadImgs/${"pic"}`}
            />
            <TagLabel>{"firstName"}</TagLabel>
          </Tag>
        </Link>
      </Center>

      {/* Chat Menu */}
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
            height="93vh"
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
              <MenuItem borderRadius={10} p={3} onClick={handleOpenChat}>
                <Avatar mr={5}>
                  <AvatarBadge boxSize="1.25em" bg="green.500" />
                </Avatar>
                <Box>
                  <Text fontSize="lg">User 1</Text>
                  <Text fontSize="sm" noOfLines={1} opacity="85%">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nihil numquam distinctio architecto repudiandae doloribus
                    adipisci nobis totam fugiat porro explicabo et deserunt sed
                    sit vel accusantium optio, amet dolores tenetur.
                  </Text>
                </Box>
              </MenuItem>
            </VStack>
          </MenuList>
        </Menu>
      </Center>

      {/* Notification Menu */}
      <Notifications/>

      {/* Settings and Options Menu */}
      <Center mr={4}>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<TriangleDownIcon />}
            rounded="full"
          />
          <MenuList w="360px" boxShadow="2xl">
            <VStack gap={2} fontSize={17}>
              <MenuItem
                icon={
                  <Avatar name="John Doe" size="lg" />
                }
              >
                <Text fontSize={20} fontWeight={500}>
                  John Doe
                </Text>
                <Text fontSize={14} color="grey">
                  See your profile
                </Text>
              </MenuItem>
              
              {/* Other Items */}
              <Item iconName={<SettingsIcon w={6} h={6} />} title="Settings & privacy" />
              <Item iconName={<QuestionIcon w={6} h={6} />} title="Help & support" />
              <Item iconName={<MoonIcon w={6} h={6} />} title="Display & accessibility" />
              <MenuItem icon={<ArrowForwardIcon w={6} h={6} />}>
                <Text fontWeight={500}>Log Out</Text>
              </MenuItem>
            </VStack>
          </MenuList>
        </Menu>
      </Center>
    </>
  );
};
