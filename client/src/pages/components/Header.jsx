import { AppBar, Avatar, Box, IconButton, Link, Typography } from '@mui/material'
import { Logout } from '@mui/icons-material'

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
        <AppBar enableColorOnDark position='sticky' sx={{ height: "5vh", display: "flex", flexDirection: "row", alignItems: "center" }}>
            <Link href="/">
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", padding: "5px 10px" }}>
                <Typography variant="h2">Chiffchaff</Typography>
                <img src="logo-icon.png" width="50" />
            </Box>
            </Link>

            <Box sx={{ flex: 5, alignSelf: "center", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <Link href="/account">
                <Box sx={{display: "flex", mr: "10px"}}>
                    <Avatar sx={{ backgroundColor: user.userColor, mr: "10px" }}>
                        <Typography variant="h5">{user.username[0].toUpperCase()}</Typography>
                    </Avatar>
                    <Typography variant="h5">{user.username}</Typography>
                </Box>
                </Link>
                <IconButton onClick={() => handleLogoutClick()}>
                        <Logout fontSize="large" sx={{ color: "background.default"}} />
                </IconButton>
            </Box>
        </AppBar>
    )
}
