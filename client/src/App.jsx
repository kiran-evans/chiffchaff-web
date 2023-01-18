import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import themeOptions from './themeOptions';
import Splash from './pages/Splash';
import Dashboard from './pages/Dashboard';
import Header from './pages/components/Header';

function App() {

  const theme = createTheme(themeOptions)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column" }}>
          <Header />
          <Box sx={{flex: 1, display: "flex", flexDirection: "column"}}>
            <Routes>
              <Route exact path="/login" element={<Splash />} />
              <Route exact path="/" element={<Dashboard />} />
            </Routes>
            </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
