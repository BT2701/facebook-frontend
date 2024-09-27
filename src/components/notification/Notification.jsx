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
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import './Notification.css'

const NotificationItem = ({ avatarSrc, title, message, time }) => (
    <MenuItem
        _hover={{ background: "#f0f2f5" }}
        p={3}
        borderRadius="md"
        alignItems="center"
        className="notification-item"
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
                <MenuList w="360px" maxH="400px" overflowY="auto" p={2} boxShadow="lg">
                    <VStack align="stretch">
                        <NotificationItem
                            avatarSrc="https://via.placeholder.com/50"
                            title="Trong Luc"
                            message="liked your post"
                            time="5 mins ago"
                        />
                        <NotificationItem
                            avatarSrc="https://via.placeholder.com/50"
                            title="Van Du"
                            message="commented on your photo"
                            time="10 mins ago"
                        />
                        <NotificationItem
                            avatarSrc="https://via.placeholder.com/50"
                            title="Tan Dat"
                            message="sent you a friend request"
                            time="1 hour ago"
                        />
                        <NotificationItem
                            avatarSrc="https://via.placeholder.com/50"
                            title="Trung Thien"
                            message="accept your friend request"
                            time="1 hour ago"
                        />
                    </VStack>
                </MenuList>
            </Menu>
        </Center>
    );
};

export default Notifications;
