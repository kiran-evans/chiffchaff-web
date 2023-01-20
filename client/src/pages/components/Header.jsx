import { AppBar, Box, IconButton, Typography } from '@mui/material'
import { AccountCircle, Logout } from '@mui/icons-material'
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
      <Box sx={{ flex: 1 }}>
        <Typography variant="h3">Chiffchaff</Typography>
      </Box>
      <Box sx={{ flex: 2, alignSelf: "center", display: "flex", justifyContent: "flex-end" }}>
        <IconButton>
          <AccountCircle />
        </IconButton>
        <IconButton onClick={() => handleLogoutClick()}>
          <Logout />
        </IconButton>
      </Box>
    </AppBar>
  )
}
