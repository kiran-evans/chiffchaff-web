import { Alert, Box, Skeleton, Snackbar, Typography } from '@mui/material'

import ContactsBar from './components/ContactsBar'
import MessageContainer from './components/MessageContainer'
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
    const [selectedContact, setSelectedContact] = useState({});

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
                <ContactsBar socket={socket} selectedContact={selectedContact} setSelectedContact={setSelectedContact} />
                <Box sx={{display: "flex", justifyContent: "center", padding: "10px 0", backgroundColor: isConnected ? "success.main" : "error.main"}}>
                <Typography>{isConnected ? <><Public />&nbsp;Connected</> : <><PublicOff />&nbsp;Disconnected</>}</Typography>
                </Box>
            </Box>
            <Box sx={{ flex: 5, display: "flex" }}>
                {Object.keys(selectedContact).length ? 
                    <MessageContainer socket={socket} contact={selectedContact} />
                    :
                    <Skeleton variant="rounded" height={"100%"} width={"100%"} />
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