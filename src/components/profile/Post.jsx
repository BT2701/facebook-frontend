import { Box, Flex, Grid, Heading, Icon, Text } from "@chakra-ui/react";
import { loadData } from "../../utils/localstore";
import { EditProfile } from "./EditProfile";
import { AiFillHeart } from "react-icons/ai";
import { MdMapsHomeWork, MdPlace, MdSkateboarding, MdAccountBalance, MdSchool } from "react-icons/md";
import { useEffect, useState } from "react";
import { Homecenter } from "../homepage/homecenter/Homecenter";
import { Feed } from "../homepage/homecenter/Feed";
import { Heroku } from "../../utils/herokuLink";

const IntroText = ({ icon, title }) => {
    return (
        <Flex my={3}>
            <Icon as={icon} w={6} h={6} color={'grey'} mr={4} />
            <Text fontSize={18}>{title}</Text>
        </Flex>
    );
};

export const Post = () => {

    return (
        <>
            <Box bg={'#f0f2f5'} minH={'300px'} pt={5} pb={'100px'}>

                <Box w={'1000px'} m={'auto'} >

                    <Grid templateColumns='38% 60%' gap={5}>
                        <Box minH={20} maxH={'420px'} bg={'white'} rounded={6} p={5} boxShadow={'lg'}>
                            <Heading fontSize={23}>Intro</Heading>
                            <Text fontSize={18} my={4}>{"bio"}</Text>
                             <IntroText title={`Studied at ${"university"}`} icon={MdSchool} /> 
                            <IntroText title={`Went to ${"school"}`} icon={MdAccountBalance} /> 
                             <IntroText title={`Lives in ${"currentCity"}`} icon={MdMapsHomeWork} /> 
                             <IntroText title={`From ${"homeTown"}`} icon={MdPlace} /> 
                             <IntroText title={"relationship"} icon={AiFillHeart} />
                             <IntroText title={"hobbies"} icon={MdSkateboarding} />

                            <EditProfile w={'100%'} m={'15px auto 5px'} title={'Edit Intro'} />

                        </Box>
                        <Box minH={20}>
                            
                                <div key={"e._id"}>
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
                                </div>
                                <div key={"e._id"}>
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
                                </div>
                        </Box>
                    </Grid>
                </Box>

            </Box>
        </>
    );
};