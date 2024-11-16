import { Box, Flex, Grid, Heading, Icon, Text } from "@chakra-ui/react";
import { loadData } from "../../utils/localstore";
import { EditProfile } from "./EditProfile";
import { AiFillHeart } from "react-icons/ai";
import { MdMapsHomeWork, MdPlace, MdSkateboarding, MdAccountBalance, MdSchool } from "react-icons/md";
import { useEffect, useState } from "react";
import { Homecenter } from "../homepage/homecenter/Homecenter";
import { Feed } from "../homepage/homecenter/Feed";
import { Heroku } from "../../utils/herokuLink";
import { useOutletContext } from "react-router-dom/dist";
import { FaTransgender, FaBirthdayCake  } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { MdOutlinePhone } from "react-icons/md";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const IntroText = ({ icon, title }) => {
    return (
        <div style={{
                display: "flex",
                alignItem: "center",
                margin: "0.75rem 0"
        }}
       >
            <Icon as={icon} w={6} h={6} color={'grey'} mr={4} />
            <Text fontSize={18}>{title}</Text>
        </div>
    );
};

const IntroLink = ({ title, icon: Icon }) => {
    const url = title.startsWith("http://") || title.startsWith("https://") ? title : `https://${title}`;

    return (
        <div style={{ display: "flex", alignItems: "center", fontSize: "20px", margin: "12px 0" }}>
            <Icon />
            <a style={{ marginLeft: "20px", color: "blue", textDecoration: "underline" }} href={url} target="_blank" rel="noopener noreferrer">
                {title}
            </a>
        </div>
    );
};

export const Post = () => {
    const { currentUser } = useUser();
    const [user, setUser] = useOutletContext();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
              const response = await axios.get(`http://localhost:8001/api/post/${user?.id}/${user?.id}?limit=10`)
              setPosts(response.data.$values);  
              console.log(response)
            } catch (error) {
              console.error("Error fetching posts:", error);
            }
          };
      
          fetchPosts();
    }, [user])

    const convertToViDate = (dateStr) => {
        const date = new Date(dateStr);

        return new Intl.DateTimeFormat('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).format(date);
    }

    const handleDeletePost = async (idPost) => {
        const confirmDelete = window.confirm("Bạn muốn xóa post?");
        if (!confirmDelete) return;
    
        try {
          const response = await axios.delete(`http://localhost:8001/api/post/${idPost}`);
          if (response.status === 204) {
            const updatePosts = posts?.filter((post) => post.id !== idPost);
            setPosts(updatePosts);
            alert("delete post thanh cong");
          } else {
            console.error("Error deleting post");
          }
        } catch (error) {
          console.error("Error: ", error);
        }
    }

    return (
        <>
            <Box bg={'#f0f2f5'} minH={'300px'} pt={5} pb={'100px'}>
                <Box w={'1000px'} m={'auto'}>
                    <Grid templateColumns='38% 60%' gap={5}>
                        <div>
                            <div 
                                style={{
                                    minHeight: "20px",
                                    maxHeight: "520px",
                                    backgroundColor: "white",
                                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                                    padding: "1.25rem",
                                    borderRadius: "6px",
                                    borderColor: "#E2E8F0"
                                }}
                            >
                                <Heading fontSize={23}>Intro</Heading>
                                { user?.education  && <IntroText title={`Studied at ${user?.education}`} icon={MdSchool} /> }
                                { user?.education  && <IntroText title={`Lives in ${user?.education}`} icon={MdMapsHomeWork} /> } 
                                { user?.phone  && <IntroText title={`${user?.phone}`} icon={MdOutlinePhone} /> } 
                                { user?.gender  && <IntroText title={`${user?.gender}`} icon={FaTransgender} /> } 
                                { user?.birth  && <IntroText title={`${user?.birth && convertToViDate(user?.birth)}`} icon={FaBirthdayCake} /> } 
                                { user?.relationship  && <IntroText title={`${user?.relationship}`} icon={AiFillHeart} /> }
                                { user?.social && <IntroLink title={`${user?.social}`} icon={IoShareSocialOutline } /> }

                                {
                                    currentUser === user?.id && (
                                        <EditProfile w={'100%'} m={'15px auto 5px'} title={'Edit Intro'} userData={user} setUser={setUser} />
                                    )
                                }
                            </div>
                        </div>
                        
                        {/* Feed section */}
                        <Box minH={20}>
                            {
                                posts?.length > 0 ? (
                                    posts.map((post, index) => (
                                        <div key={index}>
                                            <Feed key={index}
                                            postId={post?.id}
                                            profilePic={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_FWF2judaujT30K9sMf-tZFhMWpgP6xCemw&s"}
                                            content={post?.content}
                                            timeStamp={post?.timeline}
                                            userName={post?.userId}
                                            postImage={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_FWF2judaujT30K9sMf-tZFhMWpgP6xCemw&s"}
                                            likedByCurrentUser={post?.likedByCurrentUser}
                                            likeCount={post?.reactions.$values.length}
                                            commentList={post?.comments.$values}
                                            currentUserId={user?.id}
                                            userCreatePost={post?.userId}
                                            handleDeletePost={() => handleDeletePost(post?.id)}
                                            />
                                        </div>
                                    ))
                            ) : (
                                <p>Loading posts...</p>
                            )}
                            {/* <div key={"e._id"}>
                                <Feed key={"index"}
                                    postId={"post.id"}
                                    profilePic={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_FWF2judaujT30K9sMf-tZFhMWpgP6xCemw&s"}
                                    content={"post.content"}
                                    timeStamp={"post.timeline"}
                                    userName={"post.userId"}
                                    postImage={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_FWF2judaujT30K9sMf-tZFhMWpgP6xCemw&s"}
                                    likedByCurrentUser={"post.likedByCurrentUser"}
                                    likeCount={"post.reactions.$values.length"}
                                    commentList={"post.comments.$values"}
                                    currentUserId={"currentUserId"}
                                    userCreatePost={"post.userId"}
                                    handleDeletePost={"handleDeletePost"}
                                />
                            </div> */}
                        </Box>
                    </Grid>
                </Box>
            </Box>

        </>
    );
};