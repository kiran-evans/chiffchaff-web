import { Box } from '@mui/system'

import PropTypes from 'prop-types';
import { Avatar, IconButton, Tooltip, Typography } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useState } from 'react';
import { useEffect } from 'react';
import { PersonAdd, PersonAddAlt } from '@mui/icons-material';
import axios from 'axios';

export default function ChatListItem(props) {
    const { data, socket } = props;

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
        <Box sx={{ display: "flex", alignItems: "center", padding: "5px 15px", backgroundColor: "background.card", borderRadius: "10px", marginBottom: "5px" }}>
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
    socket: PropTypes.object.isRequired
}