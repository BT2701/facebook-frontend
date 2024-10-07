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
