import { Box } from '@mui/system'
import PropTypes from 'prop-types';
import { Avatar, Typography } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

export default function ChatListItem(props) {
    const { data, selectedChat } = props;

    const { user } = useContext(AuthContext);
    const [contact, setContact] = useState(null);

    useEffect(() => {
        const getContactData = async () => {
            try {
                const contactId = data.participants[0] === user._id.toString() ? data.participants[1] : data.participants[0];
                const res = await axios.get(`${import.meta.env.ENV_SERVER_URL}/user?id=${contactId}`);
                setContact(res.data);
            } catch (err) {
                throw new Error(err.response.data);
            }
        }
        getContactData();
    }, []);

    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            padding: "5px 15px",
            border: "1px solid",
            borderColor: data._id.toString() === selectedChat._id.toString() ? "primary.dark" : "primary.light",
            bgcolor: data._id.toString() === selectedChat._id.toString() ? "primary.main" : "background.card",
            color: data._id.toString() === selectedChat._id.toString() ? "primary.dark" : "text.main",
            borderRadius: "10px",
            marginBottom: "5px"
        }}>
            {contact &&
            <>
                <Avatar sx={{ backgroundColor: contact.userColor, mr: "10px" }}>
                    <Typography variant="h5">{contact.username[0].toUpperCase()}</Typography>
                </Avatar>
                <Typography variant="h5" sx={{ mr: "10px" }}>{contact.username}</Typography>
            </>
            }
        </Box>
    )
}

ChatListItem.propTypes = {
    data: PropTypes.object.isRequired,
    selectedChat: PropTypes.object
}