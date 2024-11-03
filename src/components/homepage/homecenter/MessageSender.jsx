import "./messagesender.css";
import { Avatar, Button, useDisclosure } from "@chakra-ui/react";
import { IoMdVideocam } from "react-icons/io";
import { MdPhotoLibrary, MdOutlineMood } from "react-icons/md";
import { CreatePost } from "./CreatePost";

export const MessageSender = ({ setPosts, currentUserId, fetchPosts }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="messageSender">
      <div className="messageSender__top">
        <Avatar mr={4} src={`uploadImgs/${"pic"}`} />
        <Button
          w={"80%"}
          rounded={"full"}
          mt={1}
          py={"20px"}
          onClick={onOpen} // Open the modal when clicked
        >
          What's on your mind?
        </Button>
      </div>

      <div className="messageSender__bottom">
        <div className="messageSender__option">
          <IoMdVideocam style={{ color: "red", fontSize: "22px" }} />
          <h4>Live Video</h4>
        </div>
        <div className="messageSender__option">
          <MdPhotoLibrary style={{ color: "green", fontSize: "22px" }} />
          <h4>Photo/Video</h4>
        </div>
        <div className="messageSender__option">
          <MdOutlineMood style={{ color: "yellow", fontSize: "22px" }} />
          <h4>Feeling/Activity</h4>
        </div>
      </div>

      {/* Render CreatePost as a modal */}
      {isOpen && <CreatePost setPosts={setPosts} isOpen={isOpen} onClose={onClose} currentUserId={currentUserId} />}
    </div>
  );
};
