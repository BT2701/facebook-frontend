import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useUser } from "./UserContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [receiver, setReceiver] = useState(null);
    const [post, setPost] = useState(null);
    const [content, setContent] = useState('');
    const { currentUser } = useUser();
    const [notifications, setNotifications] = useState([]);

    const deleteNotification = (receiver, post, action) => {
        const notificationId = notifications.find(notification => notification.receiver === receiver && notification.post === post && notification.action === action).id;
        axios.delete(`${process.env.REACT_APP_API_URL}/notification/${notificationId}`)
            .then(response => {
                console.log('Notification deleted:', response.data);
            })
            .catch(error => {
                console.error('Error deleting notification:', error);
            });
    }
    
    const createNotification = (receiverId, postId = null, contentStr, action) => {
        const notification = {
            user: currentUser,
            receiver: receiverId,
            post: postId,
            content: contentStr,
            action: action,
            is_read: 0,
            timeline: new Date().toISOString()
        };

        axios.post(`${process.env.REACT_APP_API_URL}/notification`, notification)
            .then(response => {
                console.log('Notification saved:', response.data);
            })
            .catch(error => {
                console.error('Error saving notification:', error);
            });
    }
    return (
        <NotificationContext.Provider value={{ receiver, setReceiver, post, setPost, content, setContent, createNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification=() =>{
    return useContext(NotificationContext);
};
