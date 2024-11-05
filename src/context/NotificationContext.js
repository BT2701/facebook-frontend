import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useUser } from "./UserContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [receiver, setReceiver] = useState(null);
    const [post, setPost] = useState(null);
    const [content, setContent] = useState('');
    const { currentUser } = useUser();

    const deleteNotification = (receiver, post = null, action) => {
        const postId=post;
        if(postId === null){
            postId = 0;
        }
        axios.delete(`${process.env.REACT_APP_API_URL}/notification/delete`, {
            params: {
            user: currentUser,
            receiver: receiver,
            post: postId,
            action_n: action
            }
        })
            .then(response => {
                console.log('Notification deleted:', response.data);
            })
            .catch(error => {
                console.error('Error deleting notification:', error);
            });
    }
    
    const createNotification = (receiverId, postId = null, contentStr, action) => {
        const post=postId;
        if(post === null){
            post = 0;
        }
        const notification = {
            user: currentUser,
            receiver: receiverId,
            post: post,
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
