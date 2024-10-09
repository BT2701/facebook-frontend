import React from "react";
import { StoryReel } from "./StoryReel";
import "./homecenter.css";
import { MessageSender } from "./MessageSender";
import { Feed } from "./Feed";
import { Box } from "@chakra-ui/react";

export const Homecenter = () => {
  return (
    <div className="Homecenter">
      <StoryReel />

      <Box mb={"7px"} w={"143%"}>
        <MessageSender wid={"100%"}/>
      </Box>

      <div key={"e._id"}>
        <Feed
          wid={"100%"}
          mgtop={"7px"}
          ProfilePic={`uploadImgs/${"e.userimg"}`}
          message={"e.title"}
          timestamp={"e.createdAt"}
          username={"e.username"}
          image={`uploadImgs/${"e.img"}`}
        />
      </div>
    </div>
  );
};
