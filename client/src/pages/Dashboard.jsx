import { Alert, Box, Snackbar, Typography } from '@mui/material'

import ContactsBar from './components/ContactsBar'
import ChatContainer from './components/ChatContainer'
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Public, PublicOff } from '@mui/icons-material';
import { useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
export default function Dashboard(props) {

    const { user } = useContext(AuthContext);

    const { socket } = props;

    const [isConnected, setIsConnected] = useState(false);
    const [alert, setAlert] = useState({ isOpen: false, severity: null, text: "" });
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
            socket.emit('ONLINE_INIT', user);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('ALERT', params => {
            setAlert({ isOpen: true, severity: params.severity, text: params.text });
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('ALERT');
        }
    }, []);

    return (
        <Box sx={{ display: "flex", flex: 1 }}>
            <Box sx={{ flex: 1, backgroundColor: "background.paper", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <ContactsBar socket={socket} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
                <Box sx={{display: "flex", justifyContent: "center", padding: "10px 0", backgroundColor: isConnected ? "success.main" : "error.main"}}>
                <Typography>{isConnected ? <><Public />&nbsp;Connected</> : <><PublicOff />&nbsp;Disconnected</>}</Typography>
                </Box>
            </Box>
            <Box sx={{ flex: 5, display: "flex" }}>
                {selectedChat &&
                    <ChatContainer socket={socket} chat={selectedChat} />
                }
            </Box>
            <Snackbar open={alert.isOpen} onClose={() => setAlert({...alert, isOpen: false})} autoHideDuration={5000}>
                <Alert severity={alert.severity}>{alert.text}</Alert>
            </Snackbar>
        </Box>
    )
}

Dashboard.propTypes = {
    socket: PropTypes.object.isRequired
}