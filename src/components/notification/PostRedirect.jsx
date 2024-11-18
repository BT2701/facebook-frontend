import React, { useState, useEffect } from 'react';
import { Feed } from '../homepage/homecenter/Feed';
import { fetchDataForPostId, getUserById } from '../../utils/getData';
import formatTimeFromDatabase from '../sharedComponents/formatTimeFromDatabase';
import './postRedirect.css';

const PostRedirect = ({ feedId, open, onClose, currentUser }) => {
    const [post, setPost] = useState({});
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const updatePostInfo = async (userId, post) => {
        try {
            const response = await getUserById(userId);
            if (response && response.data) {
                post.profilePic = response.data.avt;
                post.profileName = response.data.name;
            } else {
                console.error('Lỗi: response hoặc response.data không xác định');
            }
            if (post.comments.$values.length && Array.isArray(post.comments.$values)) {
                const updatedComments = await Promise.all(
                    post.comments.$values.map(async (comment) => {
                        return await updateCommentInfo(comment.userId, comment);
                    })
                );
                post.comments.$value = updatedComments;
            }
            return post;
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu người dùng:', error);
            return post;
        }
    };

    const updateCommentInfo = async (userId, comment) => {
        try {
            const response = await getUserById(userId);
            if (response && response.data) {
                comment.profilePic = response.data.avt;
                comment.profileName = response.data.name;
            } else {
                console.error('Lỗi: response hoặc response.data không xác định');
            }

            return comment;
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu người dùng:', error);
            return comment;
        }
    };
    const updateCommentsForPost = (postId, updatedComments) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, comments: { $values: updatedComments } } : post
          )
        );
      };

      useEffect(() => {
        const fetchData = async () => {
            setLoading(true); 
            try {
                const response = await fetchDataForPostId(feedId, currentUser);
                const data = await response.data;
                const p = await updatePostInfo(data.userId, data);
                setPost(p || {}); 
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            } finally {
                setLoading(false); 
            }
        };
    
        if (open) {
            fetchData();
        }
    }, [feedId, open]);

    if (!open) return null;
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="pr-custom-dialog-overlay">
            <div className="pr-custom-dialog">
                <div className="pr-custom-dialog-header">
                    <h3>Post</h3>
                    <button className="btn btn-danger" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="pr-custom-dialog-content">
                    <Feed
                        postId={post.id}
                        profilePic={post.profilePic}
                        content={post.content}
                        timeStamp={post.timeline ? formatTimeFromDatabase(post.timeline) : 'Ngày không hợp lệ'}
                        userName={post.profileName}
                        postImage={post.image}
                        likedByCurrentUser={post.likedByCurrentUser}
                        likeCount={post.reactions?.$values.length || []}
                        commentList={post.comments?.$values || []}
                        currentUserId={currentUser}
                        userCreatePost={post.userId}
                        setPosts={setPosts}
                        posts={posts}
                        updateComments={updateCommentsForPost}
                        updatePostInfor={updatePostInfo}
                        updateCommentInfor={updateCommentInfo}
                    />
                </div>
                <div className="pr-custom-dialog-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default PostRedirect;
