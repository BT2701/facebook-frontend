import React, { useEffect, useState } from "react";
import axios from "axios";  // Import axios
import { StoryReel } from "./StoryReel";
import "./homecenter.css";
import { MessageSender } from "./MessageSender";
import { Feed } from "./Feed";
import { Box } from "@chakra-ui/react";

export const Homecenter = () => {
  const [posts, setPosts] = useState([]);
  const currentUserId = 1; // Replace with the actual user ID

  // Fetch data from the API using axios
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/api/post/${currentUserId}`)
        setPosts(response.data.$values);  // Set the posts in the state
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [currentUserId]);

  const handleDeletePost = async (idPost) => {
    const confirmDelete = window.confirm("Bạn muốn xóa post?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:8001/api/post/${idPost}`);
      if (response.status === 204) {
        const updatePosts = posts?.filter((post) => post.id !== idPost);
        setPosts(updatePosts);
        alert("delete post thanh cong");
      } else {
        console.error("Error deleting post");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }


  return (
    <div className="Homecenter">
      <StoryReel />

      <Box mb={"7px"} w={"143%"}>
        <MessageSender wid={"100%"} />
      </Box>

      {posts?.length > 0 ? (
        posts.map((post, index) => (

          <div>
            <Feed key={index}
              postId={post.id}
              profilePic={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_FWF2judaujT30K9sMf-tZFhMWpgP6xCemw&s"}
              content={post.content}
              timeStamp={post.timeline}
              userName={post.userId}
              postImage={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_FWF2judaujT30K9sMf-tZFhMWpgP6xCemw&s"}
              likedByCurrentUser={post.likedByCurrentUser}
              likeCount={post.reactions.$values.length}
              commentList={post.comments.$values}
              currentUserId={currentUserId}
              userCreatePost={post.userId}
              handleDeletePost={handleDeletePost}
            />
          </div>
        ))
      ) : (
        <p>Loading posts...</p>
      )}
    </div>
  );
};
