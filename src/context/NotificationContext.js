import React, { createContext, useState } from 'react';
import axios from 'axios';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [receiver, setReceiver] = useState(null);
    const [post, setPost] = useState(null);
    const [content, setContent] = useState('');
    const [currentUser, setCurrentUser] = useState(5); //dat tam gia tri, doi co du lieu tu user service

    const createNotification = (receiverId, postId = null, contentStr) => {
        const notification = {
            user: currentUser,
            receiver: receiverId,
            post: postId,
            content: contentStr,
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
