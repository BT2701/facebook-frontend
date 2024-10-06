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
import { Link } from "react-router-dom";
import Notifications from "../notification/Notification";
import ChatMenu from "./ChatMenu";

const Item = ({ iconName, title }) => {
  return (
    <MenuItem icon={iconName}>
      <Text fontWeight={500}>{title}</Text>
    </MenuItem>
  );
};

export const Option = () => {
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
              <MenuItem icon={<Avatar name="John Doe" size="lg" />}>
                <Text fontSize={20} fontWeight={500}>
                  John Doe
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
