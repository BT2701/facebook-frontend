import axios from "axios";

export const getData = (id, setState) => {
  fetch(`http://localhost:1234/user/${id}`)
    .then((res) => res.json())
    .then((res) => {
      setState(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getDataInside = (id, setState) => {
  fetch(`http://localhost:1234/user/${id}`)
    .then((res) => res.json())
    .then((res) => {
      setState(res.friend_ids);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getDataRequest = (id, setState) => {
  fetch(`http://localhost:1234/user/${id}`)
    .then((res) => res.json())
    .then((res) => {
      setState(res.friend_request_in_ids);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getDataIterate = (id, state, setState) => {
  fetch(`http://localhost:1234/user/${id}`)
    .then((res) => res.json())
    .then((res) => {
      state.push(res);
      setState([...state]);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/user/${userId}`
    );

    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const getMessagesByUserId = async (userId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/message/UserMessages/${userId}/latest`
    );

    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const getMessagesByUserIdAndContactId = async (userId, contactId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/message/UserMessages/${userId}/${contactId}`
    );

    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Get friend of current user
export const getFriendsByUserId = async (userId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/friend/user/${userId}`
    );

    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// notification
export const fetchDataForNotification = async ({ currentUser }) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/notification/receiver/` + currentUser
    );
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const markAllAsReadNotification = async (currentUser) => {
  try {
    await axios.put(
      `${process.env.REACT_APP_API_URL}/notification/markAllAsRead/` +
        currentUser,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Error marking all as read:", error);
  }
};
export const markAsReadNotification = async (id) => {
  try {
    await axios.put(
      `${process.env.REACT_APP_API_URL}/notification/${id}`,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

// story
export const fetchDataForStory = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/story`);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

//friend request
// Hàm lấy danh sách yêu cầu
export const getDataRequests = async (id, pageNumber) => {
  try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/Request/requests`, {
          params: { id, pageNumber }, // Truyền tham số vào URL
      });
      return response.data; // Đảm bảo trả về dữ liệu
  } catch (error) {
      console.error('Error fetching requests:', error);
      return null; // Trả về null nếu có lỗi
  }
};


//fake data
export const getAllFriends = async (userId, pageNumber) => {
  const pageSize = 16;
  try {
      // Fake dữ liệu với 10 dòng cho mỗi trang
      const fakeFriendsData = [
        { Id: 1 , IsFriend: true, TimeLine: new Date(), UserId1: userId, UserId2: 2 },
        { Id: 2 , IsFriend: true, TimeLine: new Date(), UserId1: 3, UserId2: userId },
        { Id: 3 , IsFriend: true, TimeLine: new Date(), UserId1: 4, UserId2: userId },
        { Id: 4 , IsFriend: false, TimeLine: new Date(), UserId1: userId, UserId2: 5 },
        { Id: 5 , IsFriend: false, TimeLine: new Date(), UserId1: 6, UserId2: userId },
        { Id: 6 , IsFriend: true, TimeLine: new Date(), UserId1: userId, UserId2: 7 },
        { Id: 7 , IsFriend: false, TimeLine: new Date(), UserId1: 8, UserId2: userId },
        { Id: 8 , IsFriend: true, TimeLine: new Date(), UserId1: 9, UserId2: userId },
        { Id: 9 , IsFriend: false, TimeLine: new Date(), UserId1: userId, UserId2: 10 },
        { Id: 10 , IsFriend: true, TimeLine: new Date(), UserId1: 11, UserId2: userId },
        { Id: 11 , IsFriend: true, TimeLine: new Date(), UserId1: userId, UserId2: 12 },
        { Id: 12 , IsFriend: false, TimeLine: new Date(), UserId1: 13, UserId2: userId },
        { Id: 13 , IsFriend: true, TimeLine: new Date(), UserId1: userId, UserId2: 14 },
        { Id: 14 , IsFriend: false, TimeLine: new Date(), UserId1: 15, UserId2: userId },
        { Id: 15 , IsFriend: true, TimeLine: new Date(), UserId1: userId, UserId2: 16 },
        { Id: 16 , IsFriend: false, TimeLine: new Date(), UserId1: userId, UserId2: 17 },
        { Id: 17 , IsFriend: true, TimeLine: new Date(), UserId1: userId, UserId2: 18 },
        { Id: 18 , IsFriend: true, TimeLine: new Date(), UserId1: 19, UserId2: userId },
        { Id: 19 , IsFriend: false, TimeLine: new Date(), UserId1: userId, UserId2: 20 },
        { Id: 20 , IsFriend: true, TimeLine: new Date(), UserId1: userId, UserId2: 21 },
        { Id: 21 , IsFriend: true, TimeLine: new Date(), UserId1: 22, UserId2: userId },
    ];
      // Tạo mảng chỉ chứa bạn bè (bỏ qua userId và trả về người còn lại)
      const friendsData = fakeFriendsData.map(friend => {
          const otherUserId = friend.UserId1 === userId ? friend.UserId2 : friend.UserId1;
          return {
              Id: friend.Id,
              IsFriend: friend.IsFriend,
              TimeLine: friend.TimeLine,
              otherUserId: otherUserId, // Trả về người còn lại
          };
      });

      // Tính toán chỉ số bắt đầu và kết thúc dựa trên số trang và kích thước trang
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      // Cắt mảng dữ liệu bạn bè dựa trên trang và kích thước
      const paginatedFriends = friendsData.slice(startIndex, endIndex);

      // Giả lập thời gian chờ như đang gọi API thực
      await new Promise((resolve) => setTimeout(resolve, 500));

      return paginatedFriends; // Trả về dữ liệu bạn bè đã phân trang
  } catch (error) {
      console.error('Error fetching friends:', error);
      return null; // Trả về null nếu có lỗi
  }
};

// Hàm để lấy gợi ý bạn bè với phân trang
export const getFriendSuggestions = async (userId, pageNumber = 1) => {
  const pageSize = 12;
  try {
      // Giả lập dữ liệu gợi ý với 5 người dùng
      const fakeUserSuggestions = [
          { Id: 1000, Name: "Nguyễn Nhật Trường", Birth: new Date(1995, 4, 15), Avt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFM7OSlDxothDSCAP-CAApOdJ6qzoJCE6P2g&s", Phone: "1234567890", Email: "alice@example.com", Gender: "Female", Desc: "Loves traveling.", IsOnline: 1, LastActive: new Date(), Address: "123 Main St", Social: "Facebook", Education: "University", Relationship: "Single", TimeJoin: new Date() },
          { Id: 2000, Name: "Phạm Văn Dự", Birth: new Date(1992, 1, 20), Avt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvcKv5DrXI7ImMA_vdcVfGwbRSxpPzRW9e3Q&s", Phone: "0987654321", Email: "bob@example.com", Gender: "Male", Desc: "Gamer and tech enthusiast.", IsOnline: 0, LastActive: new Date(), Address: "456 Elm St", Social: "Twitter", Education: "High School", Relationship: "In a relationship", TimeJoin: new Date() },
          { Id: 3000, Name: "Dương Thành Trưởng", Birth: new Date(1990, 10, 10), Avt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWDWXxnmYn6KWBqmJVoqG2O0ovqbPKSF-E3g&s", Phone: "1122334455", Email: "charlie@example.com", Gender: "Male", Desc: "Foodie and chef.", IsOnline: 1, LastActive: new Date(), Address: "789 Oak St", Social: "Instagram", Education: "Culinary School", Relationship: "Married", TimeJoin: new Date() },
          { Id: 4000, Name: "Dương Gió Tai", Birth: new Date(1994, 7, 30), Avt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-IxweiKWIdzzPmlSvhK5M30yGbBsxPsFbRA&s", Phone: "2233445566", Email: "diana@example.com", Gender: "Female", Desc: "Fitness enthusiast.", IsOnline: 1, LastActive: new Date(), Address: "321 Pine St", Social: "LinkedIn", Education: "University", Relationship: "Single", TimeJoin: new Date() },
          { Id: 5000, Name: "Quỳnh Bei", Birth: new Date(1988, 2, 5), Avt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi1iXtKbyy1hraUj8QgCji8fNv1tvXqwG1tg&s", Phone: "3344556677", Email: "ethan@example.com", Gender: "Male", Desc: "Nature lover.", IsOnline: 0, LastActive: new Date(), Address: "654 Maple St", Social: "Snapchat", Education: "Community College", Relationship: "It's complicated", TimeJoin: new Date() },
          { Id: 6000, Name: "Nguyễn Nhật Trường1", Birth: new Date(1995, 4, 15), Avt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFM7OSlDxothDSCAP-CAApOdJ6qzoJCE6P2g&s", Phone: "1234567890", Email: "alice@example.com", Gender: "Female", Desc: "Loves traveling.", IsOnline: 1, LastActive: new Date(), Address: "123 Main St", Social: "Facebook", Education: "University", Relationship: "Single", TimeJoin: new Date() },
          { Id: 7000, Name: "Phạm Văn Dự1", Birth: new Date(1992, 1, 20), Avt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvcKv5DrXI7ImMA_vdcVfGwbRSxpPzRW9e3Q&s", Phone: "0987654321", Email: "bob@example.com", Gender: "Male", Desc: "Gamer and tech enthusiast.", IsOnline: 0, LastActive: new Date(), Address: "456 Elm St", Social: "Twitter", Education: "High School", Relationship: "In a relationship", TimeJoin: new Date() },
          { Id: 8000, Name: "Dương Thành Trưởng1", Birth: new Date(1990, 10, 10), Avt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWDWXxnmYn6KWBqmJVoqG2O0ovqbPKSF-E3g&s", Phone: "1122334455", Email: "charlie@example.com", Gender: "Male", Desc: "Foodie and chef.", IsOnline: 1, LastActive: new Date(), Address: "789 Oak St", Social: "Instagram", Education: "Culinary School", Relationship: "Married", TimeJoin: new Date() },
          { Id: 9000, Name: "Dương Gió Tai1", Birth: new Date(1994, 7, 30), Avt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-IxweiKWIdzzPmlSvhK5M30yGbBsxPsFbRA&s", Phone: "2233445566", Email: "diana@example.com", Gender: "Female", Desc: "Fitness enthusiast.", IsOnline: 1, LastActive: new Date(), Address: "321 Pine St", Social: "LinkedIn", Education: "University", Relationship: "Single", TimeJoin: new Date() },
          { Id: 1000, Name: "Quỳnh Bei1", Birth: new Date(1988, 2, 5), Avt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi1iXtKbyy1hraUj8QgCji8fNv1tvXqwG1tg&s", Phone: "3344556677", Email: "ethan@example.com", Gender: "Male", Desc: "Nature lover.", IsOnline: 0, LastActive: new Date(), Address: "654 Maple St", Social: "Snapchat", Education: "Community College", Relationship: "It's complicated", TimeJoin: new Date() },
          { Id: 110, Name: "Nguyễn Nhật Trường2", Birth: new Date(1995, 4, 15), Avt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFM7OSlDxothDSCAP-CAApOdJ6qzoJCE6P2g&s", Phone: "1234567890", Email: "alice@example.com", Gender: "Female", Desc: "Loves traveling.", IsOnline: 1, LastActive: new Date(), Address: "123 Main St", Social: "Facebook", Education: "University", Relationship: "Single", TimeJoin: new Date() },
          { Id: 120, Name: "Phạm Văn Dự2", Birth: new Date(1992, 1, 20), Avt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvcKv5DrXI7ImMA_vdcVfGwbRSxpPzRW9e3Q&s", Phone: "0987654321", Email: "bob@example.com", Gender: "Male", Desc: "Gamer and tech enthusiast.", IsOnline: 0, LastActive: new Date(), Address: "456 Elm St", Social: "Twitter", Education: "High School", Relationship: "In a relationship", TimeJoin: new Date() },
          { Id: 130, Name: "Dương Thành Trưởng2", Birth: new Date(1990, 10, 10), Avt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWDWXxnmYn6KWBqmJVoqG2O0ovqbPKSF-E3g&s", Phone: "1122334455", Email: "charlie@example.com", Gender: "Male", Desc: "Foodie and chef.", IsOnline: 1, LastActive: new Date(), Address: "789 Oak St", Social: "Instagram", Education: "Culinary School", Relationship: "Married", TimeJoin: new Date() },
          { Id: 140, Name: "Dương Gió Tai2", Birth: new Date(1994, 7, 30), Avt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-IxweiKWIdzzPmlSvhK5M30yGbBsxPsFbRA&s", Phone: "2233445566", Email: "diana@example.com", Gender: "Female", Desc: "Fitness enthusiast.", IsOnline: 1, LastActive: new Date(), Address: "321 Pine St", Social: "LinkedIn", Education: "University", Relationship: "Single", TimeJoin: new Date() },
          { Id: 150, Name: "Quỳnh Bei2", Birth: new Date(1988, 2, 5), Avt: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi1iXtKbyy1hraUj8QgCji8fNv1tvXqwG1tg&s", Phone: "3344556677", Email: "ethan@example.com", Gender: "Male", Desc: "Nature lover.", IsOnline: 0, LastActive: new Date(), Address: "654 Maple St", Social: "Snapchat", Education: "Community College", Relationship: "It's complicated", TimeJoin: new Date() },
        ];

      // Giả lập thời gian chờ như đang gọi API thực
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Tính toán chỉ số bắt đầu và kết thúc dựa trên số trang và kích thước trang
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      // Cắt mảng dữ liệu gợi ý dựa trên trang và kích thước
      const paginatedSuggestions = fakeUserSuggestions.slice(startIndex, endIndex);

      // Trả về mảng gợi ý người dùng đã phân trang
      return paginatedSuggestions;
  } catch (error) {
      console.error('Error fetching friend suggestions:', error);
      return null; // Trả về null nếu có lỗi
  }
};
