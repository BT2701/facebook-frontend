// Notifications.jsx
import {
    Avatar,
    Box,
    Center,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    VStack,
    Button,
    Flex
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import './Notification.css'
import { useEffect, useState } from "react";
import axios from "axios";
import formatTimeFromDatabase from "../sharedComponents/formatTimeFromDatabase";

const NotificationItem = ({ avatarSrc, title, message, time, is_read, onClick }) => (
    <MenuItem
        _hover={{ background: "#f0f2f5" }}
        p={3}
        borderRadius="md"
        alignItems="center"
        className="notification-item"
        bg={is_read === 0 ? "gray.100" : "white"}
        onClick={onClick}
    >
        <Avatar src={avatarSrc} size="mm" mr={3} className="notification-item-avt" />
        <Box className="notification-item-box">
            <Box className="notification-item-box-content">
                <Text fontWeight="bold" fontSize="md" className="notification-item-title">
                    {title}
                </Text>
                <Text fontSize="sm" color="gray.600" className="notification-item-mess" noOfLines={1}>
                    {message}
                </Text>
            </Box>

            <Text fontSize="xs" color="gray.400" className="notification-item-time">
                {time}
            </Text>
        </Box>
    </MenuItem>
);

const Notifications = () => {
    const [notificationList, setNotificationList] = useState([]);
    const [currentUser, setCurrentUser] = useState(5); //dat tam gia tri, doi co du lieu tu user service
    const [readNotification, setReadNotification]= useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/notification/receiver/` + currentUser);
                setNotificationList(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        setReadNotification(0);
    }, [readNotification]);

    const markAllAsRead = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/notification/markAllAsRead/` + currentUser,{},{withCredentials:true});
            setReadNotification(1);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };
    const markAsRead = async (id) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/notification/${id}`,{},{withCredentials:true});
            setReadNotification(1);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    return (
        <Center mr={4}>
            <Menu>
                <MenuButton
                    as={IconButton}
                    aria-label="Notifications"
                    icon={<BellIcon />}
                    rounded="full"
                    position="relative"
                />
                <MenuList w="360px" maxH="400px" p={0} boxShadow="lg">
                    {/* Tiêu đề và nút "Đánh dấu đã đọc" */}
                    <Box p={3} borderBottom="1px solid #e2e8f0">
                        <Flex justifyContent="space-between" alignItems="center" height={8}>
                            <Text fontSize="lg" fontWeight="bold">
                                Thông báo
                            </Text>
                            {notificationList.length > 0 && (
                                <Button className="notification-read-all" size="sm" colorScheme="blue" onClick={markAllAsRead}>
                                    Đánh dấu đã đọc
                                </Button>
                            )}
                        </Flex>
                    </Box>
                    {/* Danh sách thông báo */}
                    <Box maxH="320px" overflowY="auto" p={2}>
                        <VStack align="stretch">
                            {notificationList.length === 0 ? (
                                <Text>Empty</Text>
                            ) : (
                                notificationList.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        avatarSrc="https://via.placeholder.com/50"
                                        title={notification.user}
                                        message={notification.content}
                                        time={formatTimeFromDatabase(notification.timeline)}
                                        is_read={notification.is_read}
                                        onClick={() => markAsRead(notification.id)}
                                    />
                                ))
                            )}
                        </VStack>
                    </Box>
                </MenuList>
            </Menu>
        </Center>
    );
};


export default Notifications;
