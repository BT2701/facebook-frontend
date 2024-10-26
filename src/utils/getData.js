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
