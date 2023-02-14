import { AppBar, Box, IconButton, Typography } from '@mui/material'
import { Menu } from '@mui/icons-material'
import { Link } from 'react-router-dom';

export default function Header(props) {

    const { drawer, setDrawer } = props;

    return (
        <AppBar enableColorOnDark position='sticky' sx={{ height: "6vh", display: "flex", flexDirection: "row", alignItems: "center" }}>
            <IconButton sx={{marginLeft: "10px"}} onClick={() => setDrawer({...drawer, isOpen: !drawer.isOpen})}>
                <Menu sx={{fontSize: "1.6rem", color: "background.default"}} />
            </IconButton>

            
            <Link to="/" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0px 5px" }}>
                <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                    <Typography variant="h2" sx={{
                            lineHeight: "1.4rem"
                        }}>Chiffchaff</Typography>
                        <img src="logo-icon.png" style={{ width: "1.2rem", margin: "0 5px" }} />
                </Box>
            </Link>
        </AppBar>
    )
}
