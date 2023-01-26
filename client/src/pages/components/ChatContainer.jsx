import PropTypes from 'prop-types'
import { Avatar, Box, IconButton, Input, InputAdornment, Typography } from '@mui/material';
import { Send } from '@mui/icons-material';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useEffect } from 'react';
import axios from 'axios';

export default function ChatContainer(props) {

    const { user } = useContext(AuthContext);
    const { socket, chat } = props;

    const [textContent, setTextContent] = useState("");
    const [contact, setContact] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleTyping = e => {
        setTextContent(e.target.value)
    }

    const getContactData = async contactId => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${import.meta.env.ENV_SERVER_URL}/user?id=${contactId}`);
            setContact(res.data);
            setIsLoading(false);
        } catch (err) {
            throw new Error(err.response.data);
        }
    }

    useEffect(() => {
        if (user._id.toString() === chat.participants[0]) {
            getContactData(chat.participants[1]);
        } else {
            getContactData(chat.participants[0]);
        }
    }, []);

    return (
        <Box sx={{flex: 1, display: "flex", flexDirection: "column"}}>
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", padding: "20px 40px", backgroundColor: "background.paper" }}>
                {contact && <>
                    <Avatar sx={{backgroundColor: contact.userColor, height: 60, width: 60, fontSize: 40, border: "3px solid", borderColor: "background.main", mr: "10px"}}>{contact.username[0].toUpperCase()}</Avatar>
                    <Typography variant="h3">{contact.username}</Typography>
                </>}
            </Box>
            
            <Box sx={{ flex: 15 }}>
                Chat
            </Box>

            <Box sx={{ flex: 4, display: "flex", alignItems: "flex-end" }}>
                <Input sx={{ flex: 1, display: "flex", padding: "10px 20px 10px 20px", alignItems: "center", backgroundColor: "background.paper", fontSize: 20 }}
                    type="text"
                    variant="outlined"
                    placeholder='Type here'
                    value={textContent}
                    onChange={e => handleTyping(e)}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton>
                            <Send color="primary" fontSize='large' />
                        </IconButton>
                    </InputAdornment>
                } />
            </Box>
        </Box>
    )
}

ChatContainer.propTypes = {
    socket: PropTypes.object.isRequired,
    chat: PropTypes.object.isRequired
}