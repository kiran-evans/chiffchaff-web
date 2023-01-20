import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import themeOptions from './themeOptions';
import Splash from './pages/Splash';
import Dashboard from './pages/Dashboard';
import Header from './pages/components/Header';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

function App() {

  const theme = createTheme(themeOptions);

  const { user } = useContext(AuthContext);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column" }}>
          {user && <Header />}
          <Box sx={{flex: 1, display: "flex", flexDirection: "column"}}>
            <Routes>
              <Route exact path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route exact path="/login" element={user ? <Navigate to="/" /> : <Splash />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
