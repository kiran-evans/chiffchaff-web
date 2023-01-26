import { Box } from '@mui/system'

import PropTypes from 'prop-types';
import { Avatar, IconButton, Tooltip, Typography } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useState } from 'react';
import { useEffect } from 'react';
import { PersonAdd, PersonAddAlt } from '@mui/icons-material';

export default function UserSearchResultItem(props) {
    const { data, socket } = props;

    const { user } = useContext(AuthContext);

    const [isExistingContact, setIsExistingContact] = useState(false);
    const [hasSent, setHasSent] = useState(false);

    useEffect(() => {
        if (!user.contacts) return;
        for (let i = 0; i < user.contacts.length; i++) {
            if (user.contacts[i] === data._id) {
                setIsExistingContact(true);
                return;
            }
        }
    }, []);

    const [isLoading, setIsLoading] = useState(false);

    const handleAddClick = () => {
        if (isLoading || hasSent) return;
        setIsLoading(true);
        socket.emit('CONTACT_REQUEST', { userData: user, contactData: data });
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