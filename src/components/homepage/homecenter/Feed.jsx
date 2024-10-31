import React, { useState } from "react";
import { Avatar, Box, Image, Input, Button, HStack, Text, Flex } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { FiThumbsUp } from "react-icons/fi";
import { FaRegCommentAlt } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { FaEllipsisH } from 'react-icons/fa';
import "./feed.css";
import axios from "axios";
import { useNotification } from "../../../context/NotificationContext";

export const Feed = ({
    postId,
    profilePic,
    postImage,
    userName,
    timeStamp,
    content,
    likedByCurrentUser,
    likeCount,
    commentList,
    currentUserId,
    userCreatePost,
    handleDeletePost
}) => {
    const [comments, setComments] = useState(commentList); // Stores comments
    const [newComment, setNewComment] = useState(""); // New comment input
    const [commentVisible, setCommentVisible] = useState(false); // Toggles comment section visibility
    const [currentUserLiked, setCurrentUserLiked] = useState(likedByCurrentUser); // Toggles like
    const [numberLiked, setNumberLiked] = useState(likeCount);
    const [editingCommentId, setEditingCommentId] = useState(null); // Track the comment currently being edited
    const [editedContent, setEditedContent] = useState(""); // Track the content of the comment being edited
    const { createNotification, deleteNotification } = useNotification();

    const handleLikeClicked = async () => {
        currentUserLiked ? handleUnLike() : handleLike();
    };

    const handleLike = async () => {
        createNotification(userCreatePost, postId, "đã thích bài viết của bạn");
        const data = {
            UserId: currentUserId,
            Timeline: "2024-10-16T00:00:00Z",
            PostId: postId,
        };
        try {
            const response = await axios.post("http://localhost:8001/api/reaction", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                setCurrentUserLiked(true);
                setNumberLiked((prev) => prev + 1);
            } else {
                console.error("Error liking post");
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    const handleUnLike = async () => {
        // deleteNotification()
        try {
            const response = await axios.delete(
                `http://localhost:8001/api/reaction/${postId}/${currentUserId}`
            );
            if (response.status === 204) {
                setCurrentUserLiked(false);
                setNumberLiked((prev) => prev - 1);
            } else {
                console.error("Error unliking post");
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    const handleCommentSubmit = async () => {
        if (newComment.trim() !== "") {
            const data = {
                UserId: currentUserId,
                PostId: postId,
                Content: newComment,
            };
            try {
                const response = await axios.post("http://localhost:8001/api/comment", data, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 201) {
                    const updatedComments = [response.data, ...comments];
                    setComments(updatedComments);
                    setNewComment("");
                } else {
                    console.error("Error submitting comment");
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        }
    };

    const handleMenuClick = async (action, commentid) => {
        if (action === "edit") {
            setEditingCommentId(commentid);
            const commentToEdit = comments?.find((comment) => comment.id === commentid);
            setEditedContent(commentToEdit.content);
        } else if (action === "delete") {
            const confirmDelete = window.confirm("Bạn muốn xóa comment?");
            if (!confirmDelete) return;

            try {
                const response = await axios.delete(`http://localhost:8001/api/comment/${commentid}`);
                if (response.status === 204) {
                    const updatedComments = comments?.filter((comment) => comment.id !== commentid);
                    setComments(updatedComments);
                } else {
                    console.error("Error deleting comment");
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        }
    };

    const handleSaveEdit = async (commentId) => {
        if (!editedContent.trim()) return;

        try {
            const response = await axios.put(
                `http://localhost:8001/api/comment/${commentId}`,
                {
                    Content: editedContent
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 204) {
                const updatedComments = comments?.map((comment) =>
                    comment.id === commentId ? { ...comment, content: editedContent } : comment
                );
                setComments(updatedComments);
                setEditingCommentId(null);
            } else {
                console.error("Error updating comment");
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    };



    return (
        <Box w="100%" my="7px">
            <div className="feed" id={postId}>
                {/* Feed Header */}
                <div className="feed__top">
                    <Avatar src={profilePic} className="feed__avatar" />
                    <div className="feed__topInfo">
                        <h3 style={{ marginBottom: "0px" }}>CreateBy(UserID): {userName}</h3>
                        <span>{timeStamp}</span>
                    </div>
                    {currentUserId === userCreatePost && (
                        <Menu>
                            <MenuButton as={Button} ms="auto">...</MenuButton>
                            <MenuList>
                                <MenuItem >
                                    Edit
                                </MenuItem>
                                <MenuItem onClick={() => handleDeletePost(postId)}>
                                    Delete
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    )}
                </div>

                {/* Feed Content */}
                <div className="feed__bottom">
                    <p>{content}</p>
                </div>

                {/* Feed Image */}
                <div className="feed__image">
                    <Box>
                        <Image m={"auto"} h={"500px"} src={postImage} alt="" />
                    </Box>
                </div>


                {/* Feed Options (Like, Comment, Share) */}
                <div className="feed__options">
                    <div className="feed__option" onClick={handleLikeClicked}>
                        <FiThumbsUp />
                        <span style={{ paddingLeft: "10px" }}>{currentUserLiked ? `${numberLiked} Liked` : `${numberLiked} Like`}</span>
                    </div>
                    <div
                        className="feed__option"
                        onClick={() => setCommentVisible(!commentVisible)}
                    >
                        <FaRegCommentAlt />
                        <span style={{ paddingLeft: "10px" }}>{comments?.length} Comment</span>
                    </div>
                    <div className="feed__option">
                        <RiShareForwardLine />
                        <span style={{ paddingLeft: "10px" }}>Share</span>
                    </div>
                </div>

                {/* Comment Section */}
                {commentVisible && (
                    <Box mt={4} className="comment-section">
                        {/* Input field for new comments */}
                        <HStack px={4}>
                            <Input
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <Button onClick={handleCommentSubmit} colorScheme="blue">
                                Post Comment
                            </Button>
                        </HStack>

                        {/* Display list of comments */}
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment.id}>
                                    <Flex padding="15px">
                                        <Avatar
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9SRRmhH4X5N2e4QalcoxVbzYsD44C-sQv-w&s"
                                            size="md"
                                        />
                                        <Box ml={2} bgColor="#f1f2f6" borderRadius="20px" padding="10px">
                                            <Text as="h5" fontSize='md' >CommentBy(UserID):{comment.userId}</Text>
                                            {/* Conditionally show the textarea if the comment is being edited */}
                                            {editingCommentId === comment.id ? (
                                                <Input
                                                    value={editedContent}
                                                    onChange={(e) => setEditedContent(e.target.value)}
                                                    mb={4}
                                                />
                                            ) : (
                                                <Text mb={4} as="span">{comment.content}</Text>
                                            )}

                                            {/* Show Save/Cancel buttons if editing */}
                                            {editingCommentId === comment.id && (
                                                <Box mt={3}>
                                                    <Button
                                                        size="sm"
                                                        colorScheme="blue"
                                                        onClick={() => handleSaveEdit(comment.id)}
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        ml={2}
                                                        onClick={() => setEditingCommentId(null)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Menu only shown if the logged-in user is the owner of the comment */}
                                        {currentUserId === comment.userId && (
                                            <Menu>
                                                <MenuButton as={Button}>...</MenuButton>
                                                <MenuList>
                                                    <MenuItem onClick={() => handleMenuClick("edit", comment.id)}>
                                                        Edit
                                                    </MenuItem>
                                                    <MenuItem onClick={() => handleMenuClick("delete", comment.id)}>
                                                        Delete
                                                    </MenuItem>
                                                </MenuList>
                                            </Menu>
                                        )}

                                    </Flex>
                                </div>
                            ))
                        ) : (
                            <p>No comment</p>
                        )}
                    </Box>
                )}
            </div>
        </Box>
    );
};
