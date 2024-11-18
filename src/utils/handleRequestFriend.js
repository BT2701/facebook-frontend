import { addFriend, addRequest, deleteRequestById, deleteRequestBySenderIdAndReceiverId, getRequestBySenderAndReceiver, removeFriend } from "./getData";

// Hàm xử lý khi nhấn "Thêm bạn bè"
export const handleSendRequest = async (currentUserId, friendId, setFriendStatus, setIsUpdateFriends) => {
    const response = await addRequest(currentUserId, friendId);
    if (response) {
        setFriendStatus("waiting");
        if (setIsUpdateFriends) setIsUpdateFriends(prev => !prev);
    }
};

// Hàm xử lý khi xác nhận lời mời kết bạn
export const handleAcceptRequest = async (currentUserId, friendId, setFriendStatus, setIsUpdateFriends) => {
    const resGetReq = await getRequestBySenderAndReceiver(currentUserId, friendId);
    if (resGetReq) {
        const response = await addFriend(currentUserId, friendId);
        if (response) {
            await deleteRequestById(resGetReq[0]?.id);
            setFriendStatus("friend");
            if (setIsUpdateFriends) setIsUpdateFriends(prev => !prev);
        }
    }
};

// Hàm xử lý khi từ chối lời mời kết bạn
export const handleCancelRequest = async (currentUserId, friendId, setFriendStatus, setIsUpdateFriends, onClose) => {
    const response = await deleteRequestBySenderIdAndReceiverId(friendId, currentUserId);
    if (response) {
        setFriendStatus("notFriend");
        if (setIsUpdateFriends) setIsUpdateFriends(prev => !prev);
        if (onClose) onClose();
    }
};

// Hàm xử lý khi xóa bạn bè
export const handleRemoveFriend = async (currentUserId, friendId, setFriendStatus, setIsUpdateFriends, onClose) => {
    const response = await removeFriend(currentUserId, friendId);
    if (response) {
        setFriendStatus("notFriend");
        if (setIsUpdateFriends) setIsUpdateFriends(prev => !prev);
        if (onClose) onClose();
    }
};

// Hàm xử lý khi xóa lời mời kết bạn
export const handleRemoveRequest = async (currentUserId, friendId, setFriendStatus, setIsUpdateFriends, onClose) => {
    const response = await deleteRequestBySenderIdAndReceiverId(currentUserId, friendId);
    if (response) {
        setFriendStatus("notFriend");
        if (setIsUpdateFriends) setIsUpdateFriends(prev => !prev);
        if (onClose) onClose();
    }
};
