import React, { useEffect, useState } from "react";
import { Story } from "./Story";
import "./storyReel.css";
import CreateStory from "./CreateStory";
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import axios from "axios";
import { fetchDataForStory, getUserById } from "../../../utils/getData";
import { useUser } from "../../../context/UserContext";

export const StoryReel = () => {
    const [stories, setStories] = useState([]);
    const [users, setUsers] = useState({});
    const { currentUser } = useUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchDataForStory();
                const storiesData = response.data.$values;

                // Fetch user data for each story
                const userPromises = storiesData.map(story => getUserById(story.userId));
                const usersData = await Promise.all(userPromises);

                // Create a user map for quick lookup
                const usersMap = usersData.reduce((acc, user) => {
                    acc[user.data.id] = user.data;
                    return acc;
                }, {});

                setStories(storiesData);
                setUsers(usersMap);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const [visibleStoriesCount, setVisibleStoriesCount] = useState(4);
    const [startIndex, setStartIndex] = useState(0);

    const handleSeeMore = () => {
        setStartIndex((prevIndex) => prevIndex + 1);
        setVisibleStoriesCount((prevCount) => prevCount + 1);
    };

    const handleSeeLess = () => {
        setStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        setVisibleStoriesCount((prevCount) => Math.max(prevCount - 1, 4));
    };

    const handleCreateStory = async (user, image) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/story`, {
                user: user,
                image: image,
                timeline: new Date().toISOString()
            });
            setStories((prevStories) => [...prevStories, response.data]);
        } catch (error) {
            console.error('Error creating story:', error);
        }
    };

    return (
        <div className="storyReel">
            <CreateStory />
            {Array.isArray(stories) && stories.slice(startIndex, visibleStoriesCount).map((story, index) => {
                const user = users[story.userId];
                return (
                    <Story
                        key={index}
                        image={story?.image}
                        profileSrc={user?.avt}
                        userName={user?.name}
                    />
                );
            })}
            {startIndex > 0 && (
                <div className="story-seeLess" onClick={handleSeeLess}>
                    <FaArrowLeft size={30} />
                </div>
            )}
            {visibleStoriesCount < stories?.length && (
                <div className="story-seeMore" onClick={handleSeeMore}>
                    <FaArrowRight size={30} />
                </div>
            )}
        </div>
    );
};