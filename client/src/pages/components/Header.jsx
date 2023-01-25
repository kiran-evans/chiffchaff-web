import { AppBar, Avatar, Box, IconButton, Typography } from '@mui/material'
import { Logout } from '@mui/icons-material'
import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { logoutCall } from '../../context/UserActions'
import { useNavigate } from 'react-router-dom';

export default function Header() {

  const { user, dispatch } = useContext(AuthContext);
  const navigator = useNavigate();

  const handleLogoutClick = async () => {
    await logoutCall(user, dispatch);
    return navigator('/login');
  }

  return (
    <AppBar enableColorOnDark position='sticky' sx={{ width: "100vw", display: "flex", flexDirection: "row" }}>
        <Box sx={{ flex: 1, padding: "5px 10px" }}>
            <Typography variant="h3">Chiffchaff</Typography>
        </Box>
          <Box sx={{ flex: 6, alignSelf: "center", display: "flex", justifyContent: "flex-end" }}>
              <Box sx={{display: "flex", mr: "10px"}}>
                  <Avatar sx={{ backgroundColor: user.userColor, mr: "10px" }}>
                      <Typography variant="h5">{user.username[0].toUpperCase()}</Typography>
                  </Avatar>
                  <Typography variant="h5">{user.username}</Typography>
              </Box>
            <IconButton onClick={() => handleLogoutClick()}>
                <Logout />
            </IconButton>
        </Box>
    </AppBar>
  )
}
