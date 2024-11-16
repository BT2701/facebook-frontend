import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useUser } from "./UserContext";
import { useChatConn } from './ChatConnContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [receiver, setReceiver] = useState(null);
    const [post, setPost] = useState(null);
    const [content, setContent] = useState('');
    const { currentUser } = useUser();
    const { chatConn } = useChatConn();


    const deleteNotification = (receiver, post = null, action) => {
        const postId = post || 0;
        axios.delete(`${process.env.REACT_APP_API_URL}/notification/delete/${currentUser}/${receiver}/${postId}/${action}`)
            .then(response => {
                console.log('Notification deleted:', response.data);
                if (chatConn) {
                    chatConn.invoke("DeleteNotification", receiver, response.data);
                }
            })
            .catch(error => {
                console.error('Error deleting notification:', error);
            });
    };


    const createNotification = (receiverId, postId = null, contentStr, action) => {
        const post = postId;
        if (post === null) {
            post = 0;
        }
        if (receiverId === currentUser) {
            return;
        }
        const timezoneOffset = 7 * 60; // GMT+7
        const vietnamTime = new Date(new Date().getTime() + timezoneOffset * 60 * 1000).toISOString();
        const notification = {
            user: currentUser,
            receiver: receiverId,
            post: post,
            content: contentStr,
            action_n: action,
            is_read: 0,
            timeline: vietnamTime
        };
        axios.post(`${process.env.REACT_APP_API_URL}/notification`, notification)
            .then(response => {
                console.log('Notification saved:', response.data);
                if (chatConn) {
                    chatConn.invoke("SendNotification", receiverId, response.data);
                }
            })
            .catch(error => {
                console.error('Error saving notification:', error);
            });
    }
    return (
        <NotificationContext.Provider value={{ receiver, setReceiver, post, setPost, content, setContent, createNotification, deleteNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    return useContext(NotificationContext);
};
