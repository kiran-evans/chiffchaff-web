import { AppBar, Box, IconButton, Tooltip, Typography } from '@mui/material'
import { Logout, Menu } from '@mui/icons-material'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { logoutCall } from '../../context/UserActions'
import { Link, useNavigate } from 'react-router-dom';

export default function Header(props) {

    const { drawer, setDrawer } = props;

  const { user, dispatch } = useContext(AuthContext);
  const navigator = useNavigate();

  const handleLogoutClick = async () => {
    await logoutCall(user, dispatch);
    return navigator('/login');
  }

    return (
        <AppBar enableColorOnDark position='sticky' sx={{ flex: 1, display: "flex", flexDirection: "row", alignItems: "center" }}>
            <IconButton sx={{marginLeft: "10px"}} onClick={() => setDrawer({...drawer, isOpen: !drawer.isOpen})}>
                <Menu sx={{fontSize: 30, color: "background.default"}} />
            </IconButton>

            
            <Box sx={{ flex: 1, padding: "0px 5px" }}>
                <Link to="/" style={{flex: 1, display: "flex", alignItems: "center"}}>
                    <Typography variant="h2">Chiffchaff</Typography>
                    <img src="logo-icon.png" style={{width: 25, margin: "0 5px"}} />
                </Link>
            </Box>

            <Box sx={{ flex: 5, alignSelf: "center", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <Tooltip arrow title="Logout">
                    <IconButton onClick={() => handleLogoutClick()}>
                            <Logout fontSize="large" sx={{ color: "background.default"}} />
                    </IconButton>
                </Tooltip>
            </Box>
        </AppBar>
    )
}
