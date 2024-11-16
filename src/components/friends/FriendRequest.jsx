import React, { useEffect, useState } from "react";
import "./friendrequest.css";
import { Leftsidebar } from "./Leftsidebar";
import CustomCard from "./customCard";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { getDataRequests,getAllFriends ,getFriendSuggestions,getUserById,getAllRequests} from "../../utils/getData"; 
import { useLocation } from "react-router-dom";

export const FriendRequest = () => {
    const [friendRequestswithUserInfo, setfriendRequestswithUserInfo] = useState([]);
    const [friendswithUserInfo, setfriendswithUserInfo] = useState([]);
    const [friendSuggestswithUserInfo, setfriendSuggestswithUserInfo] = useState([]);
    const [page, setPage] = useState(1); // Theo dõi trang hiện tại
    const [loading, setLoading] = useState(false); // Theo dõi trạng thái tải dữ liệu
    const [hasMoreRequests, setHasMoreRequests] = useState(true); // Trạng thái để kiểm tra có còn yêu cầu hay không
    // *********************************************************************
    const userId = 1; // Lấy ID người dùng
    // *********************************************************************
    const location = useLocation(); // Sử dụng hook để lấy thông tin về đường dẫn hiện tại

    // Hàm fetch yêu cầu bạn bè
    const fetchFriendRequests = async (pageNumber) => {
        setLoading(true);
        try {
            // Gọi hàm getDataRequests và truyền setFriendRequests vào
            const data = await getDataRequests(userId, pageNumber);
            console.log("data chua xu ly:", JSON.stringify(data, null, 2)); // Chuyển đổi thành chuỗi JSON và định dạng

            // Kiểm tra dữ liệu có tồn tại và không rỗng
            if (!data || data.length === 0) {
                setHasMoreRequests(false);
                console.error("No data received or data is empty.");
                return;
            }
            if (data.length < 20) {
                setHasMoreRequests(false); // Nếu số lượng yêu cầu nhỏ hơn 20, đặt thành false
            } 
    
            // Sử dụng vòng lặp for để lấy thông tin của sender cho từng yêu cầu
            const friendRequestsWithSenderInfo = [];
            for (const request of data) {
                // Lấy thông tin người gửi từ API
                const senderInfo = await getUserById(request.sender);
                const requestWithSenderInfo = {
                    ...request,
                    Info: {
                        id: senderInfo.data.id, // Thay đổi ở đây để lấy ID người gửi từ request
                        name: senderInfo.data.name, // Hoặc bạn có thể gọi API để lấy tên thực tế
                        avatar: senderInfo.data.avt
                    },
                    status: "friendRequest" // Thêm thuộc tính status với giá trị là "friendRequest"
                };
                friendRequestsWithSenderInfo.push(requestWithSenderInfo);
            }
    
            console.log("data:", friendRequestsWithSenderInfo); // Chuyển đổi thành chuỗi JSON và định dạng
            // Cập nhật trạng thái với dữ liệu mới
            setfriendRequestswithUserInfo((prevRequests) => [
                ...prevRequests,
                ...friendRequestsWithSenderInfo
            ]);       
        } catch (error) {
            console.error("Error fetching friend requests:", error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm fetch gợi ý bạn bè
    const fetchFriendSuggestions = async (pageNumber) => {
        setLoading(true); // Bắt đầu tải dữ liệu

        try {
            const suggestions = await getFriendSuggestions(userId, pageNumber); 
            console.log("Dữ liệu gợi ý bạn bè:", JSON.stringify(suggestions, null, 2)); // Hiển thị dữ liệu gợi ý

            // Kiểm tra dữ liệu có tồn tại và không rỗng
            if (!suggestions || suggestions.length === 0) {
                setHasMoreRequests(false);
                console.error("Không có dữ liệu gợi ý hoặc dữ liệu rỗng.");
                return;
            }

            // Nếu số lượng bạn bè nhỏ hơn 20 (hoặc bất kỳ số nào mà bạn muốn), đặt cờ để ngừng tải thêm
            if (suggestions.length < 12) {
                setHasMoreRequests(false);
            }

            // Thêm thuộc tính Info và status cho từng gợi ý
            const friendsWithInfo = suggestions?.map(suggestion => ({
                ...suggestion,
                Info: {
                    id: suggestion.id, // Lấy Id từ gợi ý
                    name: suggestion.name , // Tên bạn bè, nếu không có thì sử dụng ID
                    avatar: suggestion.avt || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe52w64lGbNV6RGGmd85bXiciZjcWu6XR5rg&s" // Avatar giả lập
                },
                status: "suggest" // Thêm thuộc tính status với giá trị là "suggest"
            }));

            console.log("Dữ liệu gợi ý sau khi xử lý:", friendsWithInfo); // Hiển thị dữ liệu sau khi xử lý

            // Cập nhật trạng thái với dữ liệu gợi ý bạn bè, kết hợp dữ liệu mới với dữ liệu cũ
            setfriendSuggestswithUserInfo(prevSuggests => [...prevSuggests, ...friendsWithInfo]);
        } catch (error) {
            console.error("Lỗi khi fetch gợi ý bạn bè:", error);
        } finally {
            setLoading(false); // Kết thúc quá trình tải dữ liệu
        }
    };


    // Hàm fetch tất cả bạn bè
    const fetchAllFriends = async (pageNumber) => {
        setLoading(true);
        try {
            // Gọi hàm getAllFriends và truyền setfriendRequestswithUserInfo vào
            const data = await getAllFriends(userId, pageNumber);
            console.log("Dữ liệu chưa xử lý:", JSON.stringify(data, null, 2)); // Chuyển đổi thành chuỗi JSON và định dạng

            // Kiểm tra dữ liệu có tồn tại và không rỗng
            if (!data || data.length === 0) {
                setHasMoreRequests(false);
                console.error("Không có dữ liệu hoặc dữ liệu rỗng.");
                return;
            }

            // Nếu số lượng bạn bè nhỏ hơn 10 (hoặc bất kỳ số nào mà bạn muốn), đặt cờ để ngừng tải thêm
            if (data.length < 12) {
                setHasMoreRequests(false);
            }

            // Sử dụng vòng lặp để lấy thông tin cho từng bạn bè
            const friendsWithInfo = [];
            for (const friend of data) {
                const friendWithInfo = {
                    ...friend,
                    Info: {
                        id: friend.id, // Lấy ID của người bạn
                        name: friend.name, // Tạm thời giả lập tên bạn bè
                        avatar: friend.avt || 'data:image/jpeg;base64,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' // Avatar giả lập
                    },
                    status: "friend" // Thêm thuộc tính status với giá trị là "friendRequest"
                };
                friendsWithInfo.push(friendWithInfo);
            }

            console.log("Dữ liệu sau khi xử lý:", friendsWithInfo); // Chuyển đổi thành chuỗi JSON và định dạng
            // Cập nhật trạng thái với dữ liệu bạn bè
            setfriendswithUserInfo((prevFriends) => [
                ...prevFriends,
                ...friendsWithInfo
            ]);
        } catch (error) {
            console.error("Lỗi khi fetch tất cả bạn bè:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = () => {
        const bottom = window.innerHeight + window.scrollY;
        const totalHeight = document.body.offsetHeight;
    
        // Kiểm tra xem có cuộn đến đáy trang và còn yêu cầu để tải không
        if (bottom >= totalHeight*0.8  && !loading && hasMoreRequests) {
            setPage((prevPage) => prevPage + 1); // Tăng trang lên 1 khi cuộn gần đến đáy
            setLoading(true);
        }
    };

    // Hàm gọi dữ liệu yêu cầu bạn bè
    useEffect(() => {
        // Cuộn về đầu trang khi pathname thay đổi
        window.scrollTo(0, 0);
        if (location.pathname === '/friends') {
            setfriendRequestswithUserInfo([]); // Reset lại mảng khi đường dẫn thay đổi
            fetchFriendRequests(1); // Gọi fetchFriendRequests với trang 1
            setPage(1);
            setHasMoreRequests(true);
        } else if (location.pathname === '/friends/suggestions') {
            setfriendSuggestswithUserInfo([]);
            fetchFriendSuggestions(1); // Gọi fetchFriendSuggestions khi là '/friends/suggestions'
            setPage(1);
            setHasMoreRequests(true);
        } else if (location.pathname === '/friends/all-friends') {
            setfriendswithUserInfo([]); // Reset lại mảng khi đường dẫn thay đổi
            fetchAllFriends(1); // Gọi fetchAllFriends khi là '/friends/all-friends'
            setPage(1);
            setHasMoreRequests(true);
        }
    }, [location.pathname]); // Theo dõi pathname
    
    // Gọi fetchFriendRequests khi page thay đổi
    useEffect(() => {
        if (location.pathname === '/friends' && page>1) {
            fetchFriendRequests(page);
        }
        if (location.pathname === '/friends/all-friends' && page>1) {
            fetchAllFriends(page);
        }
        if (location.pathname === '/friends/suggestions' && page>1) {
            fetchFriendSuggestions(page);
        }
    }, [page]); // Theo dõi page dùng cho phân trang

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll); // Dọn dẹp event listener khi component unmount
        };
    }, [loading, hasMoreRequests]); // Cần thêm hasMoreRequests vào dependency array để đảm bảo tính năng hoạt động chính xác

    // Hàm để hiển thị nội dung cho Friend Requests
    const renderFriendRequests = () => (
        <Box minH={'660px'} bg={'#f0f2f5'} pb={'80px'} border={'1px solid #f0f2f5'} ml={'300px'}>
            <SimpleGrid columns={4} spacing={5} m={'auto'} minH={200}>
                {friendRequestswithUserInfo.length > 0 ? (
                    friendRequestswithUserInfo.map((request) => (
                        <CustomCard 
                            key={request.id} 
                            data={request} // Truyền từng request cho CustomCard
                        />
                    ))
                ) : (
                    <Box w="100%" textAlign="center">
                        <Text>No friend requests available.</Text>
                    </Box>
                )}
            </SimpleGrid>
            {loading && (
                <Box textAlign="center" mt={4}>
                    <Text>Loading more requests...</Text>
                </Box>
            )}
        </Box>
    );

    // Hàm để hiển thị nội dung cho Suggestions
    const renderSuggestions = () => (
        <Box minH={'660px'} bg={'#f0f2f5'} pb={'80px'} border={'1px solid #f0f2f5'} ml={'300px'}>
            <SimpleGrid columns={4} spacing={5} m={'auto'} minH={200}>
                {friendSuggestswithUserInfo.length > 0 ? (
                    friendSuggestswithUserInfo.map((suggestion) => (
                        <CustomCard 
                            key={suggestion.Info.id} // Sử dụng ID của người gợi ý làm key
                            data={suggestion} // Truyền từng suggestion cho CustomCard
                        />
                    ))
                ) : (
                    <Box w="100%" textAlign="center">
                        <Text>No friend suggestions available.</Text>
                    </Box>
                )}
            </SimpleGrid>
            {loading && (
                <Box textAlign="center" mt={4}>
                    <Text>Loading friend suggestions...</Text>
                </Box>
            )}
        </Box>
    );


    // Hàm để hiển thị nội dung cho All Friends
    const renderAllFriends = () => (
        <Box minH={'660px'} bg={'#f0f2f5'} pb={'80px'} border={'1px solid #f0f2f5'} ml={'300px'}>
            <SimpleGrid columns={4} spacing={5} m={'auto'} minH={200}>
                {friendswithUserInfo.length > 0 ? (
                    friendswithUserInfo.map((friend) => (
                        <CustomCard 
                            key={friend.id} 
                            data={friend} // Truyền từng friend cho CustomCard
                        />
                    ))
                ) : (
                    <Box w="100%" textAlign="center">
                        <Text>No friends available.</Text>
                    </Box>
                )}
            </SimpleGrid>
            {loading && (
                <Box textAlign="center" mt={4}>
                    <Text>Loading more friends...</Text>
                </Box>
            )}
        </Box>
    );

    
    return (
        <div>
            <Leftsidebar />
            {location.pathname === '/friends/suggestions' && renderSuggestions()}
            {location.pathname === '/friends/all-friends' && renderAllFriends()}
            {location.pathname === '/friends' && renderFriendRequests()}
        </div>
    );
};
