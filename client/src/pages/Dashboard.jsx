import { Box, Typography } from '@mui/material'
import React from 'react'
import ContactsBar from './components/ContactsBar'
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Public, PublicOff } from '@mui/icons-material';
import { useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
export default function Dashboard(props) {

    const { user } = useContext(AuthContext);

    const { socket } = props;

    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
            socket.emit('ONLINE_INIT', user);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });
    }, []);

  return (
    <Box sx={{ display: "flex", flex: 1 }}>
          <Box sx={{ flex: 1, backgroundColor: "background.paper", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <ContactsBar socket={socket} />
              <Box sx={{display: "flex", justifyContent: "center", padding: "10px 0", backgroundColor: isConnected ? "success.main" : "error.main"}}>
                <Typography>{isConnected ? <><Public />&nbsp;Connected</> : <><PublicOff />&nbsp;Disconnected</>}</Typography>
              </Box>
      </Box>
      <Box sx={{ flex: 4 }}>
        Messages
      </Box>
    </Box>
  )
}

Dashboard.propTypes = {
    socket: PropTypes.object.isRequired
}