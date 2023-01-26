import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import themeOptions from './themeOptions';
import Splash from './pages/Splash';
import Dashboard from './pages/Dashboard';
import Header from './pages/components/Header';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRef } from 'react';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { refreshUserData } from './context/UserActions';

function App() {

    const theme = createTheme(themeOptions);

    const { user, dispatch } = useContext(AuthContext);
    const persistedSocket = useRef(io(import.meta.env.ENV_SERVER_URL));
    const socket = persistedSocket.current;

    useEffect(() => {
        socket.on('REFRESH_USER_DATA', () => {
            refreshUserData(user, dispatch);
        });

        return () => {
            socket.off('REFRESH_USER_DATA');
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
            <Box sx={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column" }}>
                {user && <Header />}
                <Box sx={{flex: 1, display: "flex", flexDirection: "column"}}>
                <Routes>
                    <Route exact path="/" element={user ? <Dashboard socket={socket} /> : <Navigate to="/login" />} />
                    <Route exact path="/login" element={user ? <Navigate to="/" /> : <Splash />} />
                </Routes>
                </Box>
            </Box>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
