import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, IconButton, SwipeableDrawer, Tooltip, Typography } from '@mui/material'

import ContactsBar from './components/ContactsBar'
import ChatContainer from './components/ChatContainer'
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Archive, ExpandMore, Logout, Public, PublicOff } from '@mui/icons-material';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { logoutCall } from '../context/UserActions';
import { Container } from '@mui/system';
import UserSearchbar from './components/UserSearchbar';
export default function Dashboard(props) {

    const { user, dispatch } = useContext(AuthContext);

    const { socket, isConnected, setSnackbar, drawer, setDrawer } = props;

    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        socket.emit('ONLINE_INIT', user);
        setDrawer({ ...drawer, isOpen: false });
    }, []);

    const navigator = useNavigate();

    const handleLogoutClick = async () => {
        await logoutCall(user, dispatch);
        return navigator('/login');
    }

    return (
        <Box sx={{ height: "95vh" }}>
            <SwipeableDrawer
                anchor="left"
                open={drawer.isOpen}
                onClose={() => setDrawer({ ...drawer, isOpen: false })}
                elevation={6}
            >
                <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box sx={{ flex: 2, display: "flex", backgroundColor: "background.card", alignItems: "center" }}>
                        <Tooltip arrow title="Go to your account">
                            <Link style={{flex: 5}} to="/account">
                                <Box sx={{display: "flex", padding: "10px 10px", justifyContent: "center"}}>
                                    <Avatar sx={{ backgroundColor: user.userColor, mr: "10px" }}>
                                        <Typography variant="h5">{user.username[0].toUpperCase()}</Typography>
                                    </Avatar>
                                    <Typography variant="h5">{user.username}</Typography>
                                </Box>
                            </Link>
                        </Tooltip>

                        <Tooltip arrow title="Logout">
                            <IconButton sx={{flex: 1}} onClick={() => handleLogoutClick()}>
                                    <Logout fontSize="1rem" sx={{ color: "text.primary"}} />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {user.isArchived &&
                        <Accordion sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "primary.dark" }}>
                            <AccordionSummary expandIcon={<ExpandMore sx={{color: "text.primary"}} />}>
                                <Typography><Archive />&nbsp;Your account is archived.</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>Other users cannot find your account. You cannot send or receive new messages or contact requests.</Typography>
                            </AccordionDetails>
                        </Accordion>
                    }

                    <ContactsBar socket={socket} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />

                    <Box sx={{flex: 1, display: "flex", justifyContent: "center", padding: "10px 0", backgroundColor: isConnected ? "success.main" : "error.main"}}>
                        {isConnected ? <Typography color="success.dark"><Public />&nbsp;Connected</Typography> : <Typography color="error.dark"><PublicOff />&nbsp;Disconnected</Typography>}
                    </Box>
                </Box>
            </SwipeableDrawer>
            
            {selectedChat ?
                <ChatContainer socket={socket} chat={selectedChat} setSnackbar={setSnackbar} />
                :
                <Container sx={{ padding: "20px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography variant="h4">It looks like you don't have any contacts yet.</Typography>
                    <Typography variant="h5">Start by finding someone to chat with!</Typography>
                    <UserSearchbar socket={socket} />
                </Container>
            }
        </Box>
    )
}

Dashboard.propTypes = {
    socket: PropTypes.object.isRequired,
    isConnected: PropTypes.bool.isRequired
}