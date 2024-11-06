import React, { useEffect, useState } from "react";
import { Story } from "./Story";
import "./storyReel.css";
import CreateStory from "./CreateStory";
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import axios from "axios";
import { fetchDataForStory, getUserById } from "../../../utils/getData";
import { useUser } from "../../../context/UserContext";
import ImagePreviewDialog from "./ImagePreviewDialog";

export const StoryReel = () => {
    const [stories, setStories] = useState([]);
    const [users, setUsers] = useState({});
    const { currentUser } = useUser();
    const [visibleStoriesCount, setVisibleStoriesCount] = useState(4);
    const [startIndex, setStartIndex] = useState(0);
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

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


    const handleSeeMore = () => {
        setStartIndex((prevIndex) => prevIndex + 1);
        setVisibleStoriesCount((prevCount) => prevCount + 1);
    };

    const handleSeeLess = () => {
        setStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        setVisibleStoriesCount((prevCount) => Math.max(prevCount - 1, 4));
    };

    const handleCreateStory = async (user, image) => {
        alert(image);
        const formData = new FormData();
        formData.append('userId', user);
        formData.append('image', image);
        formData.append('timeline', new Date().toISOString());

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/story/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("File ID:", response.data.FileId);

            setStories((prevStories) => [...prevStories, response.data]);
            setPreviewImage(null);
            setSelectedFile(null);
        } catch (error) {
            console.error('Error creating story:', error);
        }
    };

    const handleSelectImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setPreviewImage(URL.createObjectURL(file));
                setSelectedFile(file);
            }
        };
        input.click();
    };

    const handleConfirm = () => {
        if (selectedFile) {
            handleCreateStory(currentUser, selectedFile);
        }

    };

    const handleCancel = () => {
        setPreviewImage(null);
        setSelectedFile(null);
    };

    return (
        <div className="storyReel">
            <button onClick={handleSelectImage}><CreateStory /></button>
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
            {/* Sử dụng ImagePreviewDialog */}
            <ImagePreviewDialog 
                previewImage={previewImage} 
                onConfirm={handleConfirm} 
                onCancel={handleCancel} 
            />
        </div>
    );
};