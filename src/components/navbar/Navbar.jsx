import { Box, Flex, Spacer } from "@chakra-ui/react";
import { Search } from "./Search";
import { Option } from "./Option";
import { CenterLinks } from "./CenterLinks";
import { Outlet } from "react-router-dom";
import { SignalRProvider } from "../../context/SignalRContext";
import { ChatBoxProvider } from "../../context/ChatBoxContext";
import ChatBox from "./ChatBox";

export const Navbar = () => {
  return (
    <SignalRProvider>
      <ChatBoxProvider>
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
      </ChatBoxProvider>
    </SignalRProvider>
  );
};
