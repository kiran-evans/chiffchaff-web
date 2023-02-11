import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, SwipeableDrawer, Tooltip, Typography } from '@mui/material'

import ContactsBar from './components/ContactsBar'
import ChatContainer from './components/ChatContainer'
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Archive, ExpandMore, Public, PublicOff } from '@mui/icons-material';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
export default function Dashboard(props) {

    const { user } = useContext(AuthContext);

    const { socket, isConnected, setSnackbar, drawer, setDrawer } = props;
    
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        socket.emit('ONLINE_INIT', user);
    }, []);

    return (
        <Box sx={{ display: "flex" }}>
            <SwipeableDrawer anchor="left" open={drawer.isOpen} onClose={() => setDrawer({...drawer, isOpen: false})} elevation={6}>
                <Box sx={{ flex: 1, backgroundColor: "background.paper", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Tooltip arrow title="Go to your account">
                        <Link to="/account">
                            <Box sx={{display: "flex", padding: "10px 10px", justifyContent: "center", backgroundColor: "background.card"}}>
                                <Avatar sx={{ backgroundColor: user.userColor, mr: "10px" }}>
                                    <Typography variant="h5">{user.username[0].toUpperCase()}</Typography>
                                </Avatar>
                                <Typography variant="h5">{user.username}</Typography>
                            </Box>
                        </Link>
                    </Tooltip>

                    {user.isArchived &&
                        <Accordion sx={{ display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "primary.dark" }}>
                            <AccordionSummary expandIcon={<ExpandMore sx={{color: "text.primary"}} />}>
                                <Typography><Archive />&nbsp;Your account is archived.</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>Other users cannot find your account. You cannot send or receive new messages or contact requests.</Typography>
                            </AccordionDetails>
                        </Accordion>
                    }

                    <ContactsBar socket={socket} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />

                    <Box sx={{display: "flex", justifyContent: "center", padding: "10px 0", backgroundColor: isConnected ? "success.main" : "error.main"}}>
                        {isConnected ? <Typography color="success.dark"><Public />&nbsp;Connected</Typography> : <Typography color="error.dark"><PublicOff />&nbsp;Disconnected</Typography>}
                    </Box>
                </Box>
            </SwipeableDrawer>

            <Box sx={{ flex: 1, display: "flex", height: "95vh" }}>
                {selectedChat &&
                    <ChatContainer socket={socket} chat={selectedChat} setSnackbar={setSnackbar} />
                }
            </Box>
        </Box>
    )
}

Dashboard.propTypes = {
    socket: PropTypes.object.isRequired,
    isConnected: PropTypes.bool.isRequired
}