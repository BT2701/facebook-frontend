import React, { useEffect, useState } from 'react';
import './search.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Feed } from '../homepage/homecenter/Feed';

function SearchPage() {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [keywords, setKeywords] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const keywordsFromUrl = urlParams.get('keywords');
        if (keywordsFromUrl) {
            setKeywords(keywordsFromUrl.replace(/"/g, '')); // Loại bỏ dấu nháy
            fetchData(keywordsFromUrl.replace(/"/g, '')); // Gọi API với từ khóa
        }
    }, [keywords]);

    const fetchData = async (keywords) => {
        try {
            const userResponse = await fetch(`http://localhost:8001/api/user/search?name=${keywords}`);
            const userData = await userResponse.json();
            setUsers(userData);

            const postResponse = await fetch(`http://localhost:8001/api/post/search?content=${keywords}`);
            const postData = await postResponse.json();
            setPosts(postData.$values); 
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleDeletePost = (postId) => {
        alert(postId);
    }

    return (
        <div className="search-container">
            <div className="search-content" id="search-content">
                <div className="search-mid-title">
                    <h2>Search Results for "{keywords}"</h2>
                </div>
                {/* Render Users */}
                <div className='search-content-user-scroll'>
                    <div className="search-content-user">
                        {users.map(user => (
                            <div key={user.id} className="search-content-user-box">
                                <div className="search-content-user-box-left">
                                    <img src={user.avt} alt={user.name} />
                                </div>
                                <div className="search-content-user-box-mid">
                                    <div className="search-content-user-box-mid-name">
                                        <Link to={`/profile?id=${user.id}`}>{user.name}</Link>
                                    </div>
                                    <div className="search-content-user-box-mid-bonus">
                                        <li>{user.friendsCount} {user.friendsCount > 1 ? 'Friends' : 'Friend'}</li>
                                        <li>{user.education || 'Unknown'}</li>
                                    </div>
                                </div>
                                {/* <div className="search-content-user-box-right">
                                    <button className="btn btn-primary handle-request">
                                        Add friend
                                    </button>
                                </div> */}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Render Posts */}
                <div className="search-content-post">
                    {posts.map(post => (
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
            </div>
        </div>
    );
}

export default SearchPage;
