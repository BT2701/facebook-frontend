import { 
    Box, Button, Divider, Flex, Heading, HStack, Image, Spacer, Text, useDisclosure 
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom/dist";
import { EditProfilePic } from "./EditProfilePic";
import { useUser } from "../../context/UserContext";
import { addFriend, addRequest, deleteRequestById, deleteRequestBySenderIdAndReceiverId, getFriendByUserId1AndUserId2, getRequestBySenderAndReceiver, getUserById, removeFriend } from "../../utils/getData"; // Giả sử các API này tồn tại
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from "@chakra-ui/react";

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
    const [friendStatus, setFriendStatus] = useState("notFriend"); // 'friend', 'notFriend', 'requestFriend'
    const navigate = useNavigate();
    const location = useLocation();
    const [myPic, setMyPic] = useState("");
    const [isRefreshFriends, setIsRefreshFriends] = useState(false);

    const refreshFriends = () => setIsRefreshFriends((prev) => !prev);

    const { isOpen, onOpen, onClose } = useDisclosure(); // Dialog quản lý xóa bạn bè
    const cancelRef = React.useRef();

    useEffect(() => {
        const getUser = async () => {
            const urlParams = new URLSearchParams(location.search);
            const idFromUrl = urlParams.get('id');
            const userId = idFromUrl || currentUser;

            if (userId && userId !== -1) {
                const response = await getUserById(userId);
                setUser(response.data);
                setMyPic(response.data.avt);
                // Cập nhật trạng thái bạn bè
                if (response.data.friendStatus) {
                    setFriendStatus(response.data.friendStatus); // Giả sử API trả về trạng thái
                }
            } else {
                navigate("/login");
            }
        };

        getUser();
    }, [currentUser, location.search, navigate]);

    useEffect(() => {
        const handleRequestAndFriend = async () => {
            const urlParams = new URLSearchParams(location.search);
            const userId = urlParams.get('id');

            // console.log(1)
            const resGetReq3 = await getFriendByUserId1AndUserId2(currentUser, userId);
            // console.log(resGetReq3);
            if(resGetReq3 && resGetReq3.length !== 0) {
                setFriendStatus("friend");
                return;
            }

            // console.log(2)
            const resGetReq = await getRequestBySenderAndReceiver(userId, currentUser);
            // console.log(resGetReq);
            if(resGetReq && resGetReq.length !== 0) {
                setFriendStatus("waiting");
                return;
            }

            // console.log(3)
            const resGetReq2 = await getRequestBySenderAndReceiver(currentUser, userId);
            // console.log(resGetReq2);
            if(resGetReq2 && resGetReq2.length !== 0) {
                setFriendStatus("requestFriend");
                return;
            }
        }
        handleRequestAndFriend();
    }, [currentUser, user, isRefreshFriends])

    // Hàm xử lý khi nhấn "Thêm bạn bè"
    const handleSendRequest = async () => {
        const response = await addRequest(currentUser, user?.id);
        if (response) {
            setFriendStatus("waiting");
            refreshFriends();
        }
    };

    // Hàm xử lý khi xác nhận lời mời kết bạn
    const handleAcceptRequest = async () => {
        const resGetReq = await getRequestBySenderAndReceiver(currentUser, user?.id);
        if(resGetReq) {
            const response = await addFriend(currentUser, user?.id);
            if (response) {
                await deleteRequestById(resGetReq[0]?.id);
                setFriendStatus("friend");
                refreshFriends();
            }
        }
    };

    // Hàm xử lý khi từ chối lời mời kết bạn
    const handleCancelRequest = async () => {
        const response = await deleteRequestBySenderIdAndReceiverId(user?.id, currentUser);
        if (response) {
            setFriendStatus("notFriend");
            refreshFriends();
            onClose();
        }
    };

    // Hàm xử lý khi xóa bạn bè
    const handleRemoveFriend = async () => {
        const response = await removeFriend(currentUser, user?.id);
        if (response) {
            setFriendStatus("notFriend");
            refreshFriends();
            onClose();
        }
    };

    const handleRemoveRequest = async () => {
        const response = await deleteRequestBySenderIdAndReceiverId(currentUser, user?.id);
        if (response) {
            setFriendStatus("notFriend");
            refreshFriends();
            onClose();
        }
    };

    return (
        <>
            <Box h={'300px'} bg={'white'}>
                <Box w={'950px'} h={'250px'} m={'auto'}>
                    <Box h={'190px'} mt={10}>
                        <Flex alignItems={"center"}>
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
                                {currentUser === user?.id ? (
                                    <EditProfilePic 
                                        title="Edit avatar" 
                                        user={user}
                                        setMyPic={setMyPic}
                                        myPic={myPic} 
                                    />
                                ) : (
                                    <>
                                        {friendStatus === "notFriend" && (
                                            <Button colorScheme="blue" onClick={handleSendRequest}>
                                                Add friend
                                            </Button>
                                        )}
                                        {friendStatus === "friend" && (
                                            <>
                                                <Button colorScheme="green" onClick={onOpen}>
                                                    Friend
                                                </Button>
                                                <AlertDialog
                                                    isOpen={isOpen}
                                                    leastDestructiveRef={cancelRef}
                                                    onClose={onClose}
                                                >
                                                    <AlertDialogOverlay>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                                                Remove friend
                                                            </AlertDialogHeader>
                                                            <AlertDialogBody>
                                                                Are you sure you want to remove friends?
                                                            </AlertDialogBody>
                                                            <AlertDialogFooter>
                                                                <Button ref={cancelRef} onClick={onClose}>
                                                                    Cancel
                                                                </Button>
                                                                <Button colorScheme="red" onClick={handleRemoveFriend} ml={3}>
                                                                    Remove
                                                                </Button>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialogOverlay>
                                                </AlertDialog>
                                            </>
                                        )}
                                        {friendStatus === "waiting" && (
                                            <>
                                                <Button colorScheme="green" onClick={onOpen}>
                                                    Waiting for response
                                                </Button>
                                                <AlertDialog
                                                    isOpen={isOpen}
                                                    leastDestructiveRef={cancelRef}
                                                    onClose={onClose}
                                                >
                                                    <AlertDialogOverlay>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                                                Remove friend request
                                                            </AlertDialogHeader>
                                                            <AlertDialogBody>
                                                                Are you sure you want to remove friend request?
                                                            </AlertDialogBody>
                                                            <AlertDialogFooter>
                                                                <Button ref={cancelRef} onClick={onClose}>
                                                                    Cancel
                                                                </Button>
                                                                <Button colorScheme="red" onClick={handleRemoveRequest} ml={3}>
                                                                    Remove
                                                                </Button>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialogOverlay>
                                                </AlertDialog>
                                            </>
                                        )}
                                        {friendStatus === "requestFriend" && (
                                            <>
                                                <Button colorScheme="green" onClick={handleAcceptRequest}>
                                                    Accept
                                                </Button>
                                                <Button colorScheme="red" onClick={handleCancelRequest} ml={2}>
                                                    Refuse
                                                </Button>
                                            </>
                                        )}
                                    </>
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

            <Outlet context={[user, setUser, isRefreshFriends]} />
        </>
    );
};
