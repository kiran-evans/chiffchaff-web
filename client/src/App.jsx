import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import themeOptions from './themeOptions';
import Splash from './pages/Splash';
import Dashboard from './pages/Dashboard';
import Header from './pages/components/Header';
import { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRef } from 'react';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { refreshUserData } from './context/UserActions';
import Account from './pages/Account';

function App() {

    const theme = createTheme(themeOptions);

    const { user, dispatch } = useContext(AuthContext);
    const persistedSocket = useRef(io(import.meta.env.ENV_SERVER_URL));
    const socket = persistedSocket.current;

    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('REFRESH_USER_DATA', () => {
            refreshUserData(user, dispatch);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('REFRESH_USER_DATA');
        }
    }, [user]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
            <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
                {user && <Header />}
                <Box sx={{height: user ? "95vh" : "100vh", display: "flex", flexDirection: "column"}}>
                <Routes>
                    <Route exact path="/" element={user ? <Dashboard socket={socket} isConnected={isConnected} /> : <Navigate to="/login" />} />
                    <Route exact path="/login" element={user ? <Navigate to="/" /> : <Splash />} />
                    <Route exact path="/account" element={user ? <Account /> : <Navigate to="/" />} />
                </Routes>
                </Box>
            </Box>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
