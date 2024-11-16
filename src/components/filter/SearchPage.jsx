import React, { useEffect, useState, useRef } from 'react';
import './search.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from 'react-router-dom';
import { Feed } from '../homepage/homecenter/Feed';
import { Box, Image, Spinner } from '@chakra-ui/react';
import { useSearchContext } from '../../context/SearchContext';
import { useUser } from '../../context/UserContext';
import { getUserById } from '../../utils/getData';
import formatTimeFromDatabase from '../sharedComponents/formatTimeFromDatabase';
import axios from 'axios';

function SearchPage() {
    const { currentUser } = useUser();
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [keywords, setKeywords] = useState('');
    const { input } = useSearchContext();
    // const [errorFetchUser, setErrorFetchUser] = useState("");
    // const [errorFetchPost, setErrorFetchPost] = useState("");
    const limitUser = 10;
    const limitPost = 5;
    const [offsetUser, setOffsetUser] = useState(0); 
    const [offsetPost, setOffsetPost] = useState(0); 
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const userScrollRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('keywords') || ''; 

        setKeywords(input === "" ? query : input);
        setUsers([]);
        setPosts([]);
        setOffsetUser(0); 
        setOffsetPost(0); 
        fetchPostsData(input, 0);
        fetchUsersData(input, 0);
    }, [input]);

    useEffect(() => {
        const handlePostScroll = () => {
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight * 0.9 && !isLoadingPosts) {
                loadMorePosts();
            }
        };
        window.addEventListener('scroll', handlePostScroll);
        return () => window.removeEventListener('scroll', handlePostScroll);
    }, [isLoadingPosts, offsetPost]);

    useEffect(() => {
        const handleUserScroll = () => {
            const userScrollElement = userScrollRef.current;
            if (
                userScrollElement &&
                userScrollElement.scrollTop + userScrollElement.clientHeight >= userScrollElement.scrollHeight * 0.9 &&
                !isLoadingUsers
            ) {
                loadMoreUsers();
            }
        };
        const userScrollElement = userScrollRef.current;
        if (userScrollElement) {
            userScrollElement.addEventListener('scroll', handleUserScroll);
        }
        return () => {
            if (userScrollElement) {
                userScrollElement.removeEventListener('scroll', handleUserScroll);
            }
        };
    }, [isLoadingUsers, offsetUser]);

    const loadMorePosts = () => {
        setIsLoadingPosts(true);
        fetchPostsData(keywords, offsetPost + limitPost);
    };

    const loadMoreUsers = () => {
        setIsLoadingUsers(true);
        fetchUsersData(keywords, offsetUser + limitUser);
    };

    const fetchPostsData = async (keywords, offset) => {
        try {
            const postResponse = await axios.get(`${process.env.REACT_APP_API_URL}/post/search?content=${keywords}&limit=${limitPost}&offset=${offset}`);
            const postData = await postResponse.data;
    
            if (postData && Array.isArray(postData?.$values)) {
                const postsWithUserData = await Promise.all(
                    postData.$values.map(async (post) => {
                        const user = await getUserById(post?.userId);
                        return {
                            user: user?.data,
                            ...post,
                        };
                    })
                );
    
                setPosts((prevPosts) => [...prevPosts, ...postsWithUserData]);
                setOffsetPost(offset); // Update offset
            }
        } catch (error) {
            console.log('Error fetching posts:', error);
        } finally {
            setIsLoadingPosts(false);
        }
    };
    

    const fetchUsersData = async (keywords, offset) => {
        try {
            const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/user/search?name=${keywords}&limit=${limitUser}&offset=${offset}`);
            const userData = await userResponse.data;

            if (Array.isArray(userData)) {
                // setErrorFetchUser("");
                setUsers((prevUsers) => [...prevUsers, ...userData]);
                setOffsetUser(offset); // Cập nhật offset sau khi fetch thành công
            }
        } catch (error) {
            // setErrorFetchUser(error.message);
            console.log('Error fetching users:', error);
        } finally {
            setIsLoadingUsers(false);
        }
    };

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

    const updateCommentsForPost = (postId, updatedComments) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, comments: { $values: updatedComments } } : post
          )
        );
    };

    return (
        <div className="search-container">
            <div className="search-content" id="search-content">
                <div className="search-mid-title">
                    <h2>Search Results for "{keywords}"</h2>
                </div>
                
                {/* Render Users */}
                <div className='search-content-user-scroll' ref={userScrollRef}>
                    {
                        users?.length === 0 ? (
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <span>There are currently no users matching the keyword : "{keywords}"</span>
                            </div>
                        ) : (
                            <div className="search-content-user">
                                {users?.map(user => (
                                    <div key={user.id} className="search-content-user-box">
                                        <Box 
                                            style={{ marginLeft: "10px" }}
                                            w={'50px'} 
                                            h={'50px'} 
                                            overflow={'hidden'} 
                                            rounded={'full'}
                                            display="flex" 
                                            alignItems="center" 
                                            justifyContent="center"
                                        >
                                            <Image src={user.avt} alt={user.name} objectFit="cover" w="100%" h="100%" />
                                        </Box>
                                        <div className="search-content-user-box-mid">
                                            <div style={{ marginLeft: "0.5em" }} className="search-content-user-box-mid-name">
                                                <Link to={`/profile?id=${user.id}`}>{user.name}</Link>
                                            </div>
                                            <div className="search-content-user-box-mid-bonus">
                                                <li>{user.friendsCount} {user.friendsCount > 1 ? 'Friends' : 'Friend'}</li>
                                                <li>{user.education || 'Unknown'}</li>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    }
                    {isLoadingUsers && (
                        <div style={{ display: "flex", justifyContent: "center", margin: "10px" }}>
                            <Spinner size="sm" />
                        </div>
                    )}
                </div>
                
                {/* Render Posts */}
                <div className="search-content-post">
                    {
                        posts?.length === 0 ? (
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <span>There are currently no posts matching the keyword : "{keywords}"</span>
                            </div>
                        ) : (
                            <div style={{ width: "500px", maxWidth: "500px" }}>
                                {posts?.map(post => (
                                    <Feed
                                        postId={post.id}
                                        profilePic={post.user.avt}
                                        content={post.content}
                                        timeStamp={formatTimeFromDatabase(post.timeline)}
                                        userName={post.user.name}
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
                                        userId={post?.userId}
                                    />
                                ))}
                            </div>
                        )
                    }
                    {isLoadingPosts && (
                        <div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
                            <Spinner size="lg" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
