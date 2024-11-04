import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { StoryReel } from "./StoryReel";
import "./homecenter.css";
import { MessageSender } from "./MessageSender";
import { Feed } from "./Feed";
import { Box } from "@chakra-ui/react";
import formatTimeFromDatabase from "../../sharedComponents/formatTimeFromDatabase";

export const Homecenter = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUserId = 1;
  const postsPerPage = 3; // Number of posts to fetch at once
  const [lastPostId, setLastPostId] = useState(null);
  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Construct the URL based on lastId
      const url = lastPostId
        ? `http://localhost:8001/api/post/${currentUserId}?lastPostId=${lastPostId}&limit=${postsPerPage}`
        : `http://localhost:8001/api/post/${currentUserId}?limit=${postsPerPage}`;

      const response = await axios.get(url);
      // Check if $values is an array and not null
      if (response.data.$values && Array.isArray(response.data.$values)) {
        const fetchedPosts = response.data.$values;

        if (fetchedPosts.length > 0) {
          // Set the lastId to the last fetched post's id

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
  }, [lastPostId]); // Only run once on mount

  // Update comments for a specific post
  const updateCommentsForPost = (postId, updatedComments) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, comments: { $values: updatedComments } } : post
      )
    );
  };  // Handle scrolling to load more posts
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
        <MessageSender wid={"100%"} setPosts={setPosts} currentUserId={currentUserId} fetchPosts={fetchPosts} setLastPostId={setLastPostId} />
      </Box>


      {posts?.length > 0 ? (
        posts.map((post, index) => (
          <div key={post.id}>
            <Feed
              postId={post.id}
              profilePic={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_FWF2judaujT30K9sMf-tZFhMWpgP6xCemw&s"}
              content={post.content}
              timeStamp={formatTimeFromDatabase(post.timeline)}
              userName={post.userId}
              postImage={post.image}
              likedByCurrentUser={post.likedByCurrentUser}
              likeCount={post.reactions.$values.length}
              commentList={post.comments.$values}
              currentUserId={currentUserId}
              userCreatePost={post.userId}
              setPosts={setPosts}
              posts={posts}
              updateComments={updateCommentsForPost}
              fetchPosts={fetchPosts}
            // setLastPostId={setLastPostId} // Pass setLastId if needed for other logic
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
