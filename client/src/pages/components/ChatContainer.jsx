import PropTypes from 'prop-types'
import { Avatar, Box, CircularProgress, IconButton, Input, InputAdornment, Menu, MenuItem, SpeedDial, SpeedDialAction, Tooltip, Typography } from '@mui/material';
import { Block, ManageAccounts, PersonRemove, Report, Send, VoiceOverOff } from '@mui/icons-material';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useEffect } from 'react';
import axios from 'axios';
import ChatMessages from './ChatMessages';

export default function ChatContainer(props) {

    const { user } = useContext(AuthContext);
    const { socket, chat, setSnackbar } = props;

    const [textContent, setTextContent] = useState("");
    const [contact, setContact] = useState({ username: "Deleted User", isArchived: true, isDeleted: true });
    const [isLoading, setIsLoading] = useState(null);
    const [messages, setMessages] = useState([...chat.messages]);
    const [menu, setMenu] = useState({ isOpen: false, anchorEl: null });

    const getContactData = async contactId => {
        try {
            setIsLoading('CONTACT');
            if (contactId) {
                const res = await axios.get(`${import.meta.env.ENV_SERVER_URL}/user?id=${contactId}`);
                setContact(res.data);
            } else {
                setContact({ username: "Deleted User", isArchived: true, isDeleted: true });
            }
            setIsLoading(null);
        } catch (err) {
            throw new Error(err.response.data);
        }
    }

    const getMessages = async () => {
        try {
            setIsLoading('MESSAGES');
            const res = await axios.get(`${import.meta.env.ENV_SERVER_URL}/chat?id=${chat._id.toString()}`);
            setMessages([...res.data.messages]);
            setIsLoading(null);
        } catch (err) {
            throw new Error(err.response.data);
        }
    }

    useEffect(() => {
        if (chat.participants[0] && chat.participants[0] !== user._id.toString()) {
            getContactData(chat.participants[0]);
        } else if (chat.participants[1] && chat.participants[1] !== user._id.toString()) {
            getContactData(chat.participants[1]);
        } else {
            getContactData(null);
        }
        getMessages();
        setMenu({ ...menu, isOpen: false });
    }, []);

    useEffect(() => {
        if (chat.participants[0] && chat.participants[0] === user._id.toString()) {
            getContactData(chat.participants[1]);
        } else if (chat.participants[1] && chat.participants[1] === user._id.toString()) {
            getContactData(chat.participants[0]);
        } else {
            getContactData(null);
        }
        getMessages();
    }, [chat]);

    const handleTyping = e => {
        setTextContent(e.target.value);
    }

    const handleMessageSend = e => {
        setIsLoading('MESSAGE');
        e.preventDefault();

        if (!textContent) return setIsLoading(null);
        
        socket.emit('MESSAGE_SEND', { userData: user, contactData: contact, msgBody: textContent, chatData: chat });
        setTextContent("");
        setIsLoading(null);
    }

    const handleRemoveClick = () => {
        setIsLoading('CONTACT');
        socket.emit('REMOVE_CONTACT', { userData: user, contactData: contact, chatData: chat });
        setMenu({ ...menu, isOpen: false });
        setIsLoading(null);
    }

    return (
        <Box sx={{ height: "94vh", display: "flex", flexDirection: "column" }}>
            {contact &&
                <Box sx={{
                    flex: 1,
                    display: "flex",
                    padding: "1rem 1.5rem",
                    backgroundColor: "background.paper",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <Box sx={{display: "flex", alignItems: "center"}}>
                        <Avatar sx={{backgroundColor: contact.userColor, height: "2rem", width: "2rem", fontSize: "1.5rem", borderWidth: "3px", mr: "10px"}}>{contact.username[0].toUpperCase()}</Avatar>
                        <Typography variant="h4">{contact.username}</Typography>
                    </Box>

                    {contact._id && 
                        <>
                        <IconButton onClick={e => setMenu({ isOpen: true, anchorEl: e.currentTarget })} sx={{border: "1px solid", borderColor: "text.primary"}}>
                            <ManageAccounts sx={{color: "text.primary", fontSize: "1.6rem"}} />
                        </IconButton>
                        <Menu
                            anchorEl={menu.anchorEl}
                            open={menu.isOpen}
                            onClose={() => setMenu({ ...menu, isOpen: false })}
                        >
                            <MenuItem onClick={() => handleRemoveClick()}><PersonRemove sx={{ color: "text.primary", fontSize: "1.3rem" }} />&nbsp;Remove {contact.username}</MenuItem>
                            <MenuItem><VoiceOverOff sx={{ color: "text.primary", fontSize: "1.3rem" }} />&nbsp;Mute {contact.username}</MenuItem>
                            <MenuItem><Block sx={{ color: "text.primary", fontSize: "1.3rem" }} />&nbsp;Block {contact.username}</MenuItem>
                            <MenuItem><Report sx={{ color: "text.primary", fontSize: "1.3rem" }} />&nbsp;Report {contact.username}</MenuItem>
                        </Menu>
                        </>
                    }
                </Box>
            }
            {isLoading === 'CONTACT' && <Typography variant="body1"><CircularProgress size={20} />&nbsp;Loading...</Typography>}
            
            <ChatMessages socket={socket} messages={messages} />
            {isLoading === 'MESSAGES' && <Typography variant="body1"><CircularProgress size={25} />&nbsp;Loading messages...</Typography>}
            

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "background.paper"}}>
                {!user.isArchived ? 
                    !contact.isArchived ?
                        <form onSubmit={e => handleMessageSend(e)} style={{ flex: 1, display: "flex" }}>
                            <Input sx={{ flex: 1, fontSize: "1.3rem", padding: "10px 20px 10px 20px" }}
                                type="text"
                                variant="outlined"
                                placeholder='Type here'
                                value={textContent}
                                onChange={e => handleTyping(e)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        {(isLoading && isLoading === 'MESSAGE') ?
                                            <Typography variant="body1"><CircularProgress size={20} />&nbsp;Sending...</Typography>
                                            :
                                            <IconButton onClick={e => handleMessageSend(e)}>
                                                <Send color="primary" sx={{fontSize: "2rem"}} />
                                            </IconButton>
                                        }
                                </InputAdornment>
                            } />
                        </form>
                        :
                        <Typography>{contact.isDeleted ? "This user's account has been deleted." : `You cannot send messages to ${contact.username} because their account has been archived.`}</Typography>
                    :
                    <Typography>You cannot send messages because your account is archived.</Typography>
                }
            </Box>
        </Box>
    )
}

ChatContainer.propTypes = {
    socket: PropTypes.object.isRequired,
    chat: PropTypes.object.isRequired
}