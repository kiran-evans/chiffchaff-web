import { CircularProgress, Box, Input, InputAdornment, Typography } from '@mui/material';
import { Contacts, EmojiPeople, PersonSearch, Search } from '@mui/icons-material';
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import PropTypes from 'prop-types';
import ChatRequest from './ChatRequest';
import ChatListItem from './ChatListItem';
import UserSearchResultItem from './UserSearchResultItem';

export default function ContactsBar(props) {

    const [searchQuery, setSearchQuery] = useState("");
    const [foundUsers, setFoundUsers] = useState(null);
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

    useEffect(() => {
        const getUsers = async () => {
            if (!searchQuery) return setFoundUsers(null);
            setIsLoading('USERS');
            try {
                const res = await axios.get(`${import.meta.env.ENV_SERVER_URL}/user?many=true&id=${user._id}&username=${searchQuery}`);
                setFoundUsers([...res.data]);

            } catch (err) {
                throw new Error(err.response.data);
            }
            setIsLoading(null);
        }
        getUsers();
    }, [searchQuery]);

    const handleChatClick = chat => {
        socket.emit('SELECT_CHAT', { leavingChat: selectedChat, joiningChat: chat });
        setSelectedChat(chat);
    }
    
    return (
        <Box sx={{flex: 1, display: "flex", flexDirection: "column", padding: "20px 15px", borderRight: "2px solid", borderColor: "background.card" }}>
            <Box sx={{display: "flex", justifyContent: "center"}}>
                <Typography variant="h6"><PersonSearch />&nbsp;Find Contacts</Typography>
            </Box>
            <Box sx={{ display: "flex", mt: "10px", mb: "10px", alignItems: "center" }}>
                <Input sx={{flex: 1}} startAdornment={
                    <InputAdornment position="start">
                        <Search sx={{color: "text.primary"}} />
                    </InputAdornment>
                } value={searchQuery} type="search" onChange={e => setSearchQuery(e.target.value)} placeholder="Search users" />
            </Box>
            <Box sx={{ alignSelf: "flex-start", mb: "40px" }}>
                {isLoading === 'USERS' && <Typography variant="body1"><CircularProgress size={50} />&nbsp;Searching...</Typography>}
                {foundUsers && (foundUsers.length > 0 ?
                    foundUsers.map(foundUser => (
                        <UserSearchResultItem key={foundUser._id} data={foundUser} socket={props.socket} />
                    ))
                    :
                    <Typography variant="body1" color="error">No users found</Typography>
                )}
            </Box>
                
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
                <Typography variant="h6"><Contacts />&nbsp;Your Chats</Typography>
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