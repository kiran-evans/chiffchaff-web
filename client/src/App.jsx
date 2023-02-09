import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Alert, Box, createTheme, CssBaseline, Snackbar, ThemeProvider } from '@mui/material';
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
    const [snackbar, setSnackbar] = useState({isOpen: false, severity: "info", text: ""});

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
            setSnackbar({isOpen: true, severity: "warning", text: "You have been disconnected."})
        });

        socket.on('ALERT', params => {
            setSnackbar({ isOpen: true, severity: params.severity, text: params.text });
        });

        socket.on('REFRESH_USER_DATA', () => {
            refreshUserData(user, dispatch);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('ALERT');
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
                        <Route exact path="/" element={user ? <Dashboard socket={socket} isConnected={isConnected} setSnackbar={setSnackbar} /> : <Navigate to="/login" />} />
                        <Route exact path="/login" element={user ? <Navigate to="/" /> : <Splash setSnackbar={setSnackbar} />} />
                        <Route exact path="/account" element={user ? <Account setSnackbar={setSnackbar} /> : <Navigate to="/" />} />
                    </Routes>
                    </Box>
                </Box>
                <Snackbar open={snackbar.isOpen} autoHideDuration={5000} onClose={() => setSnackbar({ ...snackbar, isOpen: false })}>
                    <Alert elevation={6} variant='filled' severity={snackbar.severity}>{snackbar.text}</Alert>
                </Snackbar>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
