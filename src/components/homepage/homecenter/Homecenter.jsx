import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { StoryReel } from "./StoryReel";
import "./homecenter.css";
import { MessageSender } from "./MessageSender";
import { Feed } from "./Feed";
import { Box } from "@chakra-ui/react";
import formatTimeFromDatabase from "../../sharedComponents/formatTimeFromDatabase";
import { useUser } from "../../../context/UserContext";
import { getUserById } from "../../../utils/getData";
import { addDays } from "date-fns";

export const Homecenter = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useUser(); // id current user 
  const postsPerPage = 3; // Number of posts to fetch at once
  const [lastPostId, setLastPostId] = useState(null);
  const updatePostInfor = async (userId, post) => {
    try {
      const response = await getUserById(userId);
      if (response && response.data) {
        post.profilePic = response.data.avt;
        post.profileName = response.data.name;
      } else {
        console.error('Error: response or response.data is undefined');
        // // Handle the case where response or response.data is missing
        // post.profilePic = 'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp'; // Or some default value
        // post.profileName = 'Anonymous'; // Or some default name
      }
      if (post.comments.$values.length && Array.isArray(post.comments.$values)) {
        const updatedComments = await Promise.all(
          post.comments.$values.map(async (comment) => {
            return await updateCommentInfor(comment.userId, comment);
          })
        );
        post.comments.$value = updatedComments;
      }
      return post;
    } catch (error) {
      console.error('Error fetching user data:', error);
      // // Handle the error (e.g., return default values or an empty object)
      // post.profilePic = "https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp';
      // post.profileName = 'Anonymous';
      return post;
    }
  };

  const updateCommentInfor = async (userId, comment) => {
    try {
      const response = await getUserById(userId);
      if (response && response.data) {
        comment.profilePic = response.data.avt;
        comment.profileName = response.data.name;
      } else {
        console.error('Error: response or response.data is undefined');
        // // Handle the case where response or response.data is missing
        // post.profilePic = 'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp'; // Or some default value
        // post.profileName = 'Anonymous'; // Or some default name
      }

      return comment;
    } catch (error) {
      console.error('Error fetching user data:', error);
      // // Handle the error (e.g., return default values or an empty object)
      // post.profilePic = "https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp';
      // post.profileName = 'Anonymous';
      return comment;
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Construct the URL based on lastId
      const url = lastPostId
        ? `${process.env.REACT_APP_API_URL}/post/${currentUser}?lastPostId=${lastPostId}&limit=${postsPerPage}`
        : `${process.env.REACT_APP_API_URL}/post/${currentUser}?limit=${postsPerPage}`;

      const response = await axios.get(url);
      // Check if $values is an array and not null
      if (response.data.$values && Array.isArray(response.data.$values)) {
        const fetchedPosts = response.data.$values;
        if (fetchedPosts.length > 0) {
          fetchedPosts.map((post) => updatePostInfor(post.userId, post));
          setLastPostId(fetchedPosts[fetchedPosts.length - 1].id);
          setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
        } else {
          console.warn("No new posts found.");
        }
      } else {
        console.error("Unexpected response format:", response.data);
        setPosts((prevPosts) => [...prevPosts]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of posts
  useEffect(() => {
    fetchPosts();
  }, [lastPostId]);

  // Update comments for a specific post
  const updateCommentsForPost = (postId, updatedComments) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, comments: { $values: updatedComments } } : post
      )
    );
  };
  // Handle scrolling to load more posts
  const handleScroll = useCallback(() => {
    const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
    if (bottom && !loading) {
      // alert(lastPostId);
      fetchPosts();
    }
  }, [loading]);
  // // Add event listener for scrolling
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="Homecenter">
      <StoryReel />
      <Box mb={"7px"} w={"143%"}>
        <MessageSender wid={"100%"} setPosts={setPosts} currentUserId={currentUser} setLastPostId={setLastPostId} updatePostInfor={updatePostInfor} />
      </Box>


      {posts?.length > 0 ? (
        posts.map((post, index) => (
          <div key={post.id}>
            <Feed
              postId={post.id}
              profilePic={post.profilePic}
              content={post.content}
              timeStamp={formatTimeFromDatabase(post.timeline)}
              userName={post.profileName}
              postImage={post.image}
              likedByCurrentUser={post.likedByCurrentUser}
              likeCount={post.reactions.$values.length}
              commentList={post.comments.$values}
              currentUserId={currentUser}
              userCreatePost={post.userId}
              setPosts={setPosts}
              posts={posts}
              updateComments={updateCommentsForPost}
              updatePostInfor={updatePostInfor}
              updateCommentInfor={updateCommentInfor}
              userId={post?.user}
            />
          </div>
        ))
      ) : (
        <p>Loading posts...</p>
      )}
      {loading && <p>Loading more posts...</p>}
    </div>
  );
};
