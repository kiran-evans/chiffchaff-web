import { Cancel, CheckCircle } from '@mui/icons-material';
import { Avatar, Box, IconButton, Tooltip, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function ChatRequest(props) {

    const { user } = useContext(AuthContext);
    const { data, socket } = props;

    return (
        <Box sx={{ display: "flex", alignItems: "center", border: "1px solid", borderColor: "background.card", borderRadius: "10px", padding: "5px 10px"}}>
            <Avatar sx={{ backgroundColor: data.userColor, mr: "10px" }}>
                <Typography variant="h5">{data.username[0].toUpperCase()}</Typography>
            </Avatar>
            <Typography variant="h5" sx={{ mr: "10px" }}>{data.username}</Typography>

            <Tooltip title="Accept" arrow>
                <IconButton onClick={() => socket.emit('CHAT_ACCEPT', { recipientData: user, senderData: data })}>
                    <CheckCircle color="success" />
                </IconButton>
            </Tooltip>

            <Tooltip title="Decline" arrow>
                <IconButton>
                    <Cancel color="error" />
                </IconButton>
            </Tooltip>
        </Box>
    )
}

ChatRequest.propTypes = {
    data: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired
}