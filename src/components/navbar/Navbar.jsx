import { Box, Flex, Spacer } from "@chakra-ui/react";
import { Search } from "./Search";
import { Option } from "./Option";
import { CenterLinks } from "./CenterLinks";
import { Outlet } from "react-router-dom";
import ChatBox from "./ChatBox";
import { useChatConn } from "../../context/ChatConnContext";
import { useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useCallConn } from "../../context/CallConnContext";

export const Navbar = () => {
  const { connectChat } = useChatConn();
  const { connectCall } = useCallConn();
  const { currentUser } = useUser();

  const initializeConnection = async () => {
    // This will be after login
    await connectChat(currentUser);
    await connectCall(currentUser);
  };

  useEffect(() => {
    initializeConnection();
  }, []);

  return (
    <>
      {/* Chat Box */}
      <ChatBox />

      <Flex
        h={"57px"}
        boxShadow={"lg"}
        pos="fixed"
        w={"100%"}
        bg={"white"}
        zIndex={2}
      >
        <Search />

        <Spacer />

        <CenterLinks />

        <Spacer />

        <Option />
      </Flex>

      <Box pt={"57px"}>
        <Outlet />
      </Box>
    </>
  );
};
