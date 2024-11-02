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
        <Flex my={3}>
            <Icon as={icon} w={6} h={6} color={'grey'} mr={4} />
            <Text fontSize={18}>{title}</Text>
        </Flex>
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
              const response = await axios.get(`http://localhost:8001/api/post/${user?.id}/${user?.id}`)
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
                        <Box minH={20} maxH={520} bg={'white'} rounded={6} p={5} boxShadow={'lg'}>
                            <Heading fontSize={23}>Intro</Heading>
                            <IntroText title={`Studied at ${user?.education}`} icon={MdSchool} />
                            <IntroText title={`Lives in ${user?.address}`} icon={MdMapsHomeWork} /> 
                            <IntroText title={`${user?.phone}`} icon={MdOutlinePhone} /> 
                            <IntroText title={`${user?.gender}`} icon={FaTransgender} /> 
                            <IntroText title={`${user?.birth && convertToViDate(user?.birth)}`} icon={FaBirthdayCake} /> 
                            <IntroText title={`${user?.relationship}`} icon={AiFillHeart} />
                            <IntroLink title={`${user?.social}`} icon={IoShareSocialOutline } />

                            {
                                currentUser === user?.id && (
                                    <EditProfile w={'100%'} m={'15px auto 5px'} title={'Edit Intro'} userData={user} setUser={setUser} />
                                )
                            }
                        </Box>
                        
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