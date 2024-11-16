import React, { useState,useEffect } from 'react';
import { Box, Image, Text, Center, Button } from '@chakra-ui/react';
import confirmDialog from '../sharedComponents/confirmDialog'; // Import hàm confirmDialo
import { deleteRequestById ,addRequest,removeFriend,addFriendAndDeleteRequest} from '../../utils/getData';
import { useUser } from '../../context/UserContext';


const CustomCard = ({ data }) => {
    const [isRequested, setIsRequested] = useState(false); // Trạng thái để kiểm tra xem đã gửi yêu cầu hay chưa
    const [hasData, setHasData] = useState(false); // Trạng thái kiểm tra dữ liệu// Kiểm tra dữ liệu có tồn tại hay không
    const [status, setStatus] = useState(''); // Trạng thái lưu status
    const [statusBtn, setStatusBtn] = useState(''); // Trạng thái lưu button ẩn
    const [idFriend,setIdFriend]=useState('');
    const [idRequest,setIdRequest]=useState('');
    const [idSendRequest,setIdSendRequest]=useState(0);// lưu trạng thái khi đã gửi kết bạn thì sẽ hiện nút hủy lời mời
    const [isDisplay,setIsDisplay]=useState(true);// lưu trạng thái khi đã gửi kết bạn thì sẽ hiện nút hủy lời mời
    const { currentUser } = useUser();


    // ******************************************************************
    const userId = currentUser; // Lấy ID người dùng
    // *********************************************************************
     // Cập nhật hasData khi dữ liệu thay đổi
     useEffect(() => {
        console.log("Data in CustomCard:", data); // In ra dữ liệu nhận được
        setHasData(!!data); // Kiểm tra xem dữ liệu có tồn tại không
        setStatus(data?.status); // Lấy status từ data (nếu có)
        setIdFriend(data.Info.id);
        setIdRequest(data.id);
    }, [data]);

    const handleConfirm = async () => {
        try {
            // Gọi hàm xử lý xác nhận ở đây (ví dụ, API call)
            const response = await addFriendAndDeleteRequest(userId,idFriend,idRequest); // Giả sử có một hàm xác nhận yêu cầu
            if (response) { // Nếu thành công
                setIsRequested(true); // Cập nhật trạng thái
                setStatusBtn('Request accepted');
            }else {
                alert("có lỗi khi gửi lời mời kết bạn");
            }
        } catch (error) {
            console.error("Error confirming request:", error);
        }
    };
    const handleAddFriend = async () => {
        try {
            // Gọi hàm xử lý xác nhận ở đây (ví dụ, API call)
            const response = await addRequest(userId,data.Info.id); // Giả sử có một hàm xác nhận yêu cầu
            if (response) { // Nếu thành công
                setIdSendRequest(response.id)
            }
        } catch (error) {
            console.error("Error confirming request:", error);
        }
    };

    const handleDelete = async () => {
        const isConfirmed = await confirmDialog(
            'Xác nhận xóa', // Tiêu đề
            'Bạn có chắc chắn muốn xóa không?', // Nội dung
            'warning' // Icon (có thể sử dụng 'warning', 'info', 'success', 'error', 'question')
        );
    
        if (isConfirmed) {
            try {
                // Kiểm tra giá trị của status để gọi hàm xử lý phù hợp
                let response;
                if (status === 'friendRequest') {
                    // Gọi hàm xóa yêu cầu kết bạn
                    response = await deleteRequestById(data.id);
                    if (response) {
                        setIsRequested(true);
                        setStatusBtn('Request deleted');
                    } else {
                        console.log("Có lỗi xảy ra khi xóa yêu cầu kết bạn.");
                    }
                } else if (status === 'friend') {
                    // Gọi hàm removeFriend để xóa bạn bè qua API
                    removeFriend(userId, idFriend).then((response) => {
                        if (response) {
                            setIsRequested(true); 
                            setStatusBtn('Friend deleted');
                        } else {
                            console.log("Có lỗi xảy ra khi xóa bạn bè.");
                        }
                    });
                }
            } catch (error) {
                console.error("Error deleting request:", error);
            }
        }
    };
    const handleDeleteRequest = async () => {
        try {
            const response = await deleteRequestById(idSendRequest); // Đảm bảo là hàm này trả về promise
            if (response === true) {
                setIdSendRequest(0); // Cập nhật idSendRequest sau khi xóa thành công
            } else {
                console.log("Không thể xóa yêu cầu.");
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi xóa yêu cầu:", error);
        }
    };
    const handleRemove = async () => {
        setIsDisplay(false);
    }
    return (
        isDisplay ? (
            <Box rounded={8} bg={'white'} h={'360px'} overflow={'hidden'} boxShadow={'lg'} display="flex" flexDirection="column">
                {hasData ? (
                    <>
                        <Box h={'200px'} overflow={'hidden'}>
                            <Image 
                                w={'100%'} 
                                src={data.Info.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe52w64lGbNV6RGGmd85bXiciZjcWu6XR5rg&s'} 
                                alt={data.Info.name} 
                            />
                        </Box>
                        <Box h={'20px'} p={4} mb={5}>
                            <Text fontWeight={500} fontSize={20}>{data.Info.name}</Text>
                        </Box>
    
                        <Box flexGrow={1} /> {/* Khoảng trống để đẩy nút xuống dưới */}
    
                        {/* Nút Confirm, Delete, hoặc Add Friend */}
                        {!isRequested ? (
                            <>
                                {status === 'friendRequest' && (
                                    <>
                                        <Center h={'50px'} w={'100%'} p={4} mr={'5px'}>
                                            <Button
                                                w={'100%'}
                                                bgColor={"#2e81f4"}
                                                color={"white"}
                                                _hover={{ bg: "#1c63b8" }}
                                                onClick={handleConfirm}
                                            >
                                                Confirm
                                            </Button>
                                        </Center>
                                        <Center h={'50px'} w={'100%'} p={4} mr={'5px'}>
                                            <Button
                                                w={'100%'}
                                                _hover={{ bg: "#d3d3d3" }}
                                                onClick={handleDelete}
                                            >
                                                Delete
                                            </Button>
                                        </Center>
                                    </>
                                )}
                                
                                {status === 'friend' && (
                                    <>
                                        <Center h={'50px'} w={'100%'} p={4} mr={'5px'}>
                                            <Button
                                                w={'100%'}
                                                bgColor={"#2e81f4"}
                                                color={"white"}
                                                _hover={{ bg: "#1c63b8" }}
                                            >
                                                View Profile
                                            </Button>
                                        </Center>
                                        <Center h={'50px'} w={'100%'} p={4} mr={'5px'}>
                                            <Button
                                                w={'100%'}
                                                _hover={{ bg: "#d3d3d3" }}
                                                onClick={handleDelete}
                                            >
                                                Delete Friend
                                            </Button>
                                        </Center>
                                    </>
                                )}
    
                                {status === 'suggest' && (
                                    <>
                                        {/* Kiểm tra nếu có idSendRequest thì không hiển thị nút Add Friend */}
                                        {idSendRequest == 0 ? (
                                            <>
                                                <Center h={'50px'} w={'100%'} p={4} mr={'5px'}>
                                                    <Button
                                                        w={'100%'}
                                                        bgColor={"#2e81f4"} // Màu xanh dương cho nút Add Friend
                                                        color={"white"}
                                                        _hover={{ bg: "#1c63b8" }} // Màu xanh đậm hơn khi hover
                                                        onClick={handleAddFriend}
                                                    >
                                                        Add Friend
                                                    </Button>
                                                </Center>
                                                <Center h={'50px'} w={'100%'} p={4} mr={'5px'}>
                                                    <Button
                                                        w={'100%'}
                                                        _hover={{ bg: "#d3d3d3" }}
                                                        onClick={handleRemove}
                                                    >
                                                        Remove
                                                    </Button>
                                                </Center>
                                            </>
                                        ) : (
                                            /* Hiển thị nút Delete Request nếu có idSendRequest */
                                            <Center h={'50px'} w={'100%'} p={4} mr={'5px'}>
                                                <Button
                                                    w={'100%'}
                                                    _hover={{ bg: "#d3d3d3" }}
                                                    onClick={handleDeleteRequest}
                                                >
                                                    Cancel
                                                </Button>
                                            </Center>
                                        )}
                                    </>
                                )}
                            </>
                        ) : (
                            <Center h={'50px'} w={'100%'} p={4} mr={'5px'} pb="29%">
                                <Button 
                                    w={'100%'} 
                                    isDisabled={true} 
                                    bg="#808080" 
                                    color="black" 
                                    _hover={{ bg: undefined }} // Ngăn hiệu ứng hover
                                >
                                    {statusBtn}
                                </Button>
                            </Center>
                        )}
                    </>
                ) : (
                    <Center h={'360px'} w={'100%'} p={4}>
                        <Text fontSize={20} color={"gray.500"}>No friend request data available.</Text>
                    </Center>
                )}
            </Box>
        ) : null
    );    
};


export default CustomCard;
