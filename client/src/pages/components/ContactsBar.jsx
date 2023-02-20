import { CircularProgress, Box, Typography } from '@mui/material';
import { Contacts, EmojiPeople, PersonSearch } from '@mui/icons-material';
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import PropTypes from 'prop-types';
import ChatRequest from './ChatRequest';
import ChatListItem from './ChatListItem';
import UserSearchbar from './UserSearchbar';

export default function ContactsBar(props) {
    
    const [isLoading, setIsLoading] = useState(null);
    const [chats, setChats] = useState([]);
    const [chatRequests, setChatRequests] = useState([]);
    
    const { user } = useContext(AuthContext);

    const { socket, selectedChat, setSelectedChat } = props;

    useEffect(() => {
        socket.on('CHAT_REQUEST', contactData => {
            setChatRequests([...chatRequests, contactData]);
        });

        return () => {
            socket.off('CHAT_REQUEST');
        }
    }, []);

    useEffect(() => {
        const getChats = async () => {
            if (!user.chats.length) return;
            setIsLoading('CHATS');
            let tempChats = [];
            for await (const chatId of user.chats) {
                try {
                    const foundChat = await axios.get(`${import.meta.env.ENV_SERVER_URL}/chat?id=${chatId}`);
                    tempChats.push(foundChat.data);
                } catch (err) {
                    throw new Error(err.response.data);
                }
            }

            tempChats.sort(function(a, b) {
                return Date.parse(b.lastModified) - Date.parse(a.lastModified);
            });

            setChats([...tempChats]);

            if (user.chats.length > 0) {
                socket.emit('SELECT_CHAT', { leavingChat: selectedChat, joiningChat: tempChats[0] });
                setSelectedChat(tempChats[0]);
            }
            setIsLoading(null);
        }
        getChats();

        const getChatRequests = async () => {
            if (!user.chatRequests.length) return setChatRequests([]);
            setIsLoading('CHAT_REQUESTS');
            let tempChatRequests = [];
            for await (const contactRequestId of user.chatRequests) {
                try {
                    const foundUser = await axios.get(`${import.meta.env.ENV_SERVER_URL}/user?id=${contactRequestId}`);
                    tempChatRequests.push(foundUser.data);
                } catch (err) {
                    throw new Error(err.response.data);
                }
            }
            setChatRequests([...tempChatRequests]);
            setIsLoading(null);
        }
        getChatRequests();
    }, []);

    const handleChatClick = chat => {
        socket.emit('SELECT_CHAT', { leavingChat: selectedChat, joiningChat: chat });
        setSelectedChat(chat);
    }
    
    return (
        <Box sx={{flex: 30, display: "flex", flexDirection: "column", padding: "20px 15px", borderRight: "2px solid", borderColor: "background.card" }}>
            <Box sx={{display: "flex", justifyContent: "center"}}>
                <Typography variant="h6"><PersonSearch />&nbsp;Find Contacts</Typography>
            </Box>
            <UserSearchbar socket={socket} />
                
            {!user.isArchived && <>
                <Box sx={{display: "flex", justifyContent: "center"}}>
                    <Typography variant="h6"><EmojiPeople />&nbsp;Contact Requests</Typography>
                </Box>
                <Box sx={{ alignSelf: "flex-start", mt: "20px", mb: "40px" }}>
                    {chatRequests.map(contact => (
                        <ChatRequest key={contact._id} data={contact} socket={props.socket} />
                    ))}
                </Box>
            </>
            }

            <Box sx={{display: "flex", justifyContent: "center"}}>
                <Typography variant="h6"><Contacts />&nbsp;Your Contacts</Typography>
            </Box>
            <Box sx={{ mt: "20px", mb: "20px" }}>
                {isLoading === 'CHATS' && <Typography variant="body1"><CircularProgress size={20} />&nbsp;Loading...</Typography>}                    
                {chats.length > 0 &&
                    chats.map(chat => (
                        <Box key={chat._id} onClick={() => handleChatClick(chat)} sx={{cursor: "pointer"}}>
                            <ChatListItem data={chat} selectedChat={selectedChat} />
                        </Box>)
                    )
                }
            </Box>
        </Box>
    )
}

ContactsBar.propTypes = {
    socket: PropTypes.object.isRequired,
    selectedChat: PropTypes.object,
    setSelectedChat: PropTypes.func.isRequired
}