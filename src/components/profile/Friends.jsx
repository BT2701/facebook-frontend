import { Box, Center, Flex, Heading, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDataInside, getDataIterate, getFriendsByUserId } from "../../utils/getData";
import { loadData, saveData } from "../../utils/localstore";
import { useOutletContext } from "react-router-dom/dist";


const FriendBox = ({ name, src, id }) => {
    const navigate = useNavigate();
    const handleOnclick = (id) => {
        navigate("/profile?id=" + id);
    }

    return (
        <Box onClick={() => handleOnclick(id)} border={'1px solid #e4e4e4'} h={'120px'} rounded={6} p={3}>
            <Flex>
                <Center w={'95px'} h={'95px'} overflow={'hidden'} rounded={10} mr={5}>
                    <Image w={'100%'} height={'100%'} src={src} objectFit={'cover'} />
                </Center>
                <Center h={'95px'}>
                    <Heading cursor={'pointer'} fontSize={16}>{name}</Heading>
                </Center>
            </Flex>
        </Box>
    );
};

const NewText = () => {
    return (
        <Flex justify={'center'} mt={'50px'}>
            <Text fontSize={20} color={'grey'} fontWeight={800}>No friends to show</Text>
        </Flex>
    )
}

export const Friends = () => {
    const [ user ] = useOutletContext();
    const [friends, setFriends] = useState([]);
    
    useEffect(() => {
        console.log(user);
        if(user?.id) {
            const getFriends = async () => {
                const friendRes = await getFriendsByUserId(user?.id);
                setFriends(friendRes.data);
            }
            getFriends();
        }
    }, [user])

    return (
        <>
            <Box bg={'#f0f2f5'} minH={'300px'} pt={5} pb={'100px'} >

                <Box w={'950px'} m={'auto'} bg={'white'} rounded={6} minH={'200px'} p={5}>

                    <Heading fontSize={23}>Friends</Heading>
                    {
                        friends.length === 0 ? (
                            <NewText /> 
                        ) : (
                            <SimpleGrid columns={2} spacing={10} mt={8}>
                                {
                                    friends.map((f) => (
                                        <FriendBox id={f?.id} key={f?.id} name={f?.name} src={f?.avt  || "https://archive.org/download/placeholder-image/placeholder-image.jpg"} />
                                    ))
                                }
                            </SimpleGrid>
                        )
                    }
                </Box>
            </Box>
        </>
    );
};

//"https://via.placeholder.com/200"