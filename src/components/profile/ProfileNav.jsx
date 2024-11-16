import { Box, Button, Divider, Flex, Heading, HStack, Image, Spacer, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { loadData } from "../../utils/localstore";
import { EditProfilePic } from "./EditProfilePic";
import { useUser } from "../../context/UserContext";
import { getUserById } from "../../utils/getData";
import { useNavigate } from "react-router-dom/dist";


const NewButton = ({ title, path }) => {
    return (
        <Button color={'#3a3a3a'} p={6} mr={2} bg={'white'}>
            <Link to={path}>{title}</Link>
        </Button>
    );
};


export const ProfileNav = () => {
    const { currentUser } = useUser();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [myPic, setMyPic] = useState("");

    useEffect(() => {
        const getUser = async () => {
            // nếu có ?id=... thì lấy, không thì lấy id từ currentUser
            const urlParams = new URLSearchParams(location.search);
            const idFromUrl = urlParams.get('id');
            const userId = idFromUrl || currentUser;

            if (userId && userId !== -1) {
                const response = await getUserById(userId);
                setUser(response.data);
                setMyPic(response.data.avt);
                console.log(response);
            } 
            else {
                navigate("/login");
            }
        };

        getUser();
    }, [currentUser, location.search, navigate]);

    return (
        <>
            <Box h={'300px'} bg={'white'}>
                <Box w={'950px'} h={'250px'} m={'auto'}>

                    <Box h={'190px'} mt={10}>
                        <Flex>
                            <Box 
                                w={'180px'} 
                                h={'180px'} 
                                rounded={'full'} 
                                overflow={'hidden'} 
                                border={'2px solid #ececec'} 
                                display="flex" 
                                alignItems="center" 
                                justifyContent="center"
                            >
                                <Image 
                                    src={myPic || "https://archive.org/download/placeholder-image/placeholder-image.jpg"} 
                                    objectFit="cover" 
                                    w="100%" 
                                    h="100%"
                                />
                            </Box>
                            <Box p={5} mt={7}>
                                <Heading>{user?.name}</Heading>
                                <Text color={'grey'}>{5} Friends</Text>
                                <Text maxW="500px" >{user?.desc}</Text>
                            </Box>
                            <Spacer />
                            <Box>
                                {currentUser === user?.id && (
                                    <EditProfilePic 
                                        m="120px 50px" 
                                        title="Edit avatar" 
                                        user={user}
                                        setMyPic={setMyPic}
                                        myPic={myPic} 
                                    />
                                )}
                            </Box>
                        </Flex>
                    </Box>

                    <Divider />

                    <Box h={'50px'} mt={3}>
                        <HStack>
                            <NewButton title={'Post'} path={'/profile?id='  + user?.id} />
                            <NewButton title={'Friends'} path={'/profile/friends?id=' + user?.id} />
                        </HStack>
                    </Box>
                </Box>
            </Box>

            <Outlet context={[user, setUser]} />
        </>
    );
};