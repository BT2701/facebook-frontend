import React, { useEffect, useState, useRef } from 'react';
import './search.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Feed } from '../homepage/homecenter/Feed';
import { Box, Image, Spinner } from '@chakra-ui/react';
import { useSearchContext } from '../../context/SearchContext';

function SearchPage() {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [keywords, setKeywords] = useState('');
    const { input } = useSearchContext();
    const [errorFetchUser, setErrorFetchUser] = useState("");
    const [errorFetchPost, setErrorFetchPost] = useState("");
    const limitUser = 10;
    const limitPost = 5; 
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const userScrollRef = useRef(null);

    useEffect(() => {
        setKeywords(input);
        setUsers([]);
        setPosts([]);
        fetchPostsData(input);
        fetchUsersData(input);
    }, [input]);

    useEffect(() => {
        const handlePostScroll = () => {
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight * 0.9 && !isLoadingPosts) {
                loadMorePosts();
            }
        };
        window.addEventListener('scroll', handlePostScroll);
        return () => window.removeEventListener('scroll', handlePostScroll);
    }, [isLoadingPosts]);

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
    }, [isLoadingUsers]);

    const loadMorePosts = () => {
        setIsLoadingPosts(true);
        fetchPostsData(keywords);
    };

    const loadMoreUsers = () => {
        setIsLoadingUsers(true);
        fetchUsersData(keywords);
    };

    const fetchPostsData = async (keywords) => {
        try {
            const postResponse = await fetch(`http://localhost:8001/api/post/search?content=${keywords}&limit=${limitPost}`);
            const postData = await postResponse.json();
            setErrorFetchPost("");
            setPosts((prevPosts) => [...prevPosts, ...postData.$values]);
        } catch (error) {
            setErrorFetchPost(error.message);
        } finally {
            setIsLoadingPosts(false);
        }
    };

    const fetchUsersData = async (keywords) => {
        try {
            const userResponse = await fetch(`http://localhost:8001/api/user/search?name=${keywords}&limit=${limitUser}`);
            const userData = await userResponse.json();
            
            if (Array.isArray(userData)) {
                setErrorFetchUser("");
                setUsers((prevUsers) => [...prevUsers, ...userData]);
            } else {
                throw new Error("Expected an array but received a different type.");
            }
        } catch (error) {
            setErrorFetchUser(error.message);
            console.error('Error fetching users:', error);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const handleDeletePost = (postId) => {
        alert(postId);
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
                        errorFetchUser ? (
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
                        errorFetchPost ? (
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <span>There are currently no posts matching the keyword : "{keywords}"</span>
                            </div>
                        ) : (
                            <div style={{ width: "500px", maxWidth: "500px" }}>
                                {posts?.map(post => (
                                    <Feed
                                        key={post.id}
                                        postId={post.id}
                                        profilePic={post.image} 
                                        postImage={post.image}
                                        userName={post.userId} 
                                        timeStamp={new Date(post.timeline).toLocaleString()} 
                                        content={post.content}
                                        likedByCurrentUser={post.likedByCurrentUser} 
                                        likeCount={post.reactions?.$values.length || 0}
                                        commentList={post.comments.$values} 
                                        currentUserId={1} 
                                        userCreatePost={post.userId} 
                                        handleDeletePost={handleDeletePost} 
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
