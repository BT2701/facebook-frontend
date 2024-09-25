import React, { useState, useEffect } from 'react';
import './search.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faUser, faBorderAll } from '@fortawesome/free-solid-svg-icons';

function SearchPage() {
    return (
        <div className="search-container">
            <div className="search-left">
                <div className="search-left-title">
                    <h2>Search Results</h2>
                </div>
                <div className="search-left-content">
                    <h3>Filters</h3>
                    <button className="btn" >
                        <FontAwesomeIcon icon={faBorderAll} /> All
                    </button>
                    <button className="btn" >
                        <FontAwesomeIcon icon={faNewspaper} /> Post
                    </button>
                    <button className="btn" >
                        <FontAwesomeIcon icon={faUser} /> People
                    </button>
                </div>
            </div>
            <div className="search-content" id="search-content">
                {/* Render Users */}
                <div className="search-content-user">
                    
                        <div key={"user.id"} className="search-content-user-box">
                            <div className="search-content-user-box-left">
                                <img src={`/Static/Images/${"user.avt"}`} alt={"user.name"} />
                            </div>
                            <div className="search-content-user-box-mid">
                                <div className="search-content-user-box-mid-name">
                                    <a href={`/profile?userId=${"user.id"}`}>{"user.name"}</a>
                                </div>
                                <div className="search-content-user-box-mid-bonus">
                                    <li>{"user.friendsCount"} {"user.friendsCount" > 1 ? 'Friends' : 'Friend'}</li>
                                    <li>{"user.education "|| 'Unknown'}</li>
                                </div>
                            </div>
                            <div className="search-content-user-box-right">
                                <button className="btn btn-primary handle-request" >
                                    Add friend
                                </button>
                            </div>
                        </div>
                    
                </div>
                {/* Render Posts */}
                <div className="search-content-post">
                    
                        <div key={"post.id"} className="search-content-post-box">
                            <div className="search-content-post-header">
                                <div className="search-content-post-header-left">
                                    <img src={`/Static/Images/${"post.user.avt"}`} alt={"post.user.name"} />
                                </div>
                                <div className="search-content-post-header-mid">
                                    <a href={`/profile?userId=${"post.user.id"}`}>{"post.user.name"}</a>
                                    <li>{"post.getTimePost()"}</li>
                                </div>
                            </div>
                            <div className="search-content-post-mid">
                                <p>{"post.content"}</p>
                                <img src={`/Static/Images/${"post.image"}`} alt="post-img" />
                            </div>
                        </div>
                    
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
