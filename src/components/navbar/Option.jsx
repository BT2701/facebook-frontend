import {
  Avatar,
  Center,
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
  MoonIcon,
  QuestionIcon,
  SettingsIcon,
  TriangleDownIcon,
} from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import Notifications from "../notification/Notification";
import ChatMenu from "./ChatMenu";
import { useUser } from "../../context/UserContext.js";
import { useEffect, useState } from "react";
import { getUserById } from "../../utils/getData.js";

const Item = ({ iconName, title }) => {
  return (
    <MenuItem icon={iconName}>
      <Text fontWeight={500}>{title}</Text>
    </MenuItem>
  );
};

export const Option = () => {
  const { currentUser } = useUser();
  const [user, setUser] = useState({});
  const nav = useNavigate();

  useEffect(() => {
    const getUser = async () => {
        const userId = currentUser;

        if (userId && userId !== -1) {
            const response = await getUserById(userId);
            setUser(response.data);
            console.log(response);
        }
    };

    getUser();
  }, [currentUser])

  return (
    <>
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
              name={user?.name || ""}
              ml={-1}
              mr={2}
              src={user?.avt || ""}
            />
            <TagLabel>{user?.name || ""}</TagLabel>
          </Tag>
        </Link>
      </Center>

      {/* Chat Menu */}
      <ChatMenu />

      {/* Notification Menu */}
      <Notifications />

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
                onClick={() => {
                  nav("/profile");
                }} 
                 
                icon={<Avatar src={user?.avt || ""} name={user?.name || ""} size="lg" />}
              >
                <Text fontSize={20} fontWeight={500}>
                  {user?.name || ""}
                </Text>
                <Text fontSize={14} color="grey">
                  See your profile
                </Text>
              </MenuItem>

              {/* Other Items */}
              <Item
                iconName={<SettingsIcon w={6} h={6} />}
                title="Settings & privacy"
              />
              <Item
                iconName={<QuestionIcon w={6} h={6} />}
                title="Help & support"
              />
              <Item
                iconName={<MoonIcon w={6} h={6} />}
                title="Display & accessibility"
              />
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
