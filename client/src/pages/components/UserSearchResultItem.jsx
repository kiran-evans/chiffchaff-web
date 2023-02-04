import { Box } from '@mui/system'

import PropTypes from 'prop-types';
import { Avatar, IconButton, Tooltip, Typography } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useState } from 'react';
import { useEffect } from 'react';
import { PersonAdd, PersonAddAlt } from '@mui/icons-material';
import axios from 'axios';

export default function UserSearchResultItem(props) {
    const { data, socket } = props;

    const { user } = useContext(AuthContext);

    const [isExistingContact, setIsExistingContact] = useState(true);
    const [hasSent, setHasSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getChatData = async () => {
            if (!user.chats.length) return setIsExistingContact(false);;

            for (let i = 0; i < user.chats.length; i++) {
                try {
                    const res = await axios.get(`${import.meta.env.ENV_SERVER_URL}/chat?id=${user.chats[i]}`);
                    if (res.data.participants.includes(data._id)) {
                        setIsExistingContact(true);
                        return;
                    }
                } catch (err) {
                    throw new Error(err.response.data);
                }
            }
            setIsExistingContact(false);
        }
        getChatData();
    }, []);

    const handleAddClick = () => {
        if (isLoading || hasSent) return;
        setIsLoading(true);
        socket.emit('CHAT_REQUEST', { userData: user, contactData: data });
        setHasSent(true);
        setIsLoading(false);
        return;
    }

    return (
        <Box sx={{display: "flex", alignItems: "center", padding: "5px 15px", backgroundColor: "background.card", borderRadius: "10px", marginBottom: "5px"}}>
            <Avatar sx={{ backgroundColor: data.userColor, mr: "10px" }}>
                <Typography variant="h5">{data.username[0].toUpperCase()}</Typography>
            </Avatar>
            <Typography variant="h5" sx={{ mr: "10px" }}>{data.username}</Typography>
            
            {!isExistingContact &&
                <Tooltip title={hasSent ? `Request sent` : `Send request`} arrow>
                    <IconButton onClick={() => handleAddClick()}>{hasSent ? <PersonAddAlt /> : <PersonAdd />}</IconButton>
                </Tooltip>
            }
        </Box>
    )
}

UserSearchResultItem.propTypes = {
    data: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired
}