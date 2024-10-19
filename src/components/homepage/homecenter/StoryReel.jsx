import React, { useEffect, useState } from "react";
import { Story } from "./Story";
import "./storyReel.css";
import CreateStory from "./CreateStory";
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'; // Thêm icon mũi tên trái và phải
import axios from "axios";
import { fetchDataForStory } from "../../../utils/getData";

export const StoryReel = () => {
    // Mảng chứa danh sách các story
    const [stories, setStories] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchDataForStory();
                setStories(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // State để theo dõi số lượng story hiển thị
    const [visibleStoriesCount, setVisibleStoriesCount] = useState(4);
    const [startIndex, setStartIndex] = useState(0); // Chỉ số bắt đầu hiển thị

    // Hàm xử lý khi nhấn nút mũi tên phải
    const handleSeeMore = () => {
        setStartIndex((prevIndex) => prevIndex + 1); // Tăng chỉ số bắt đầu thêm 2
        setVisibleStoriesCount((prevCount) => prevCount + 1); // Thêm 2 story mỗi lần nhấn
    };

    // Hàm xử lý khi nhấn nút mũi tên trái
    const handleSeeLess = () => {
        setStartIndex((prevIndex) => Math.max(prevIndex - 1, 0)); // Giảm chỉ số bắt đầu 2, đảm bảo không âm
        setVisibleStoriesCount((prevCount) => Math.max(prevCount - 1, 4)); // Giảm số lượng hiển thị, đảm bảo ít nhất 4
    };

    const handleCreateStory = async (user, image) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/story`, {
                user: user,
                image: image,
                timeline: new Date().toISOString()
            });
            // Thêm story mới vào danh sách stories
            setStories((prevStories) => [...prevStories, response.data]);
        } catch (error) {
            console.error('Error creating story:', error);
        }
    };


    return (
        <div className="storyReel">
            <CreateStory />
            {stories.slice(startIndex, visibleStoriesCount).map((story, index) => (
                <Story
                    key={index}
                    image={story?.image}
                    ProfileSrc={"story?.user.avt"}
                    userName={"story.user.userName"}
                    title={"story.title"}
                />
            ))}
            {/* Hiển thị mũi tên trái nếu có story để hiển thị */}
            {startIndex > 0 && (
                <div className="story-seeLess" onClick={handleSeeLess}>
                    <FaArrowLeft size={30} />
                </div>
            )}
            {/* Hiển thị mũi tên phải nếu còn story để xem */}
            {visibleStoriesCount < stories.length && (
                <div className="story-seeMore" onClick={handleSeeMore}>
                    <FaArrowRight size={30} />
                </div>
            )}
        </div>
    );
};
