import { Alert, Box, Button, CircularProgress, FormControl, Input, InputLabel, Link, Snackbar, Typography } from '@mui/material'

import { useState, useContext } from 'react'
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { loginCall } from '../context/UserActions';
import { useNavigate } from 'react-router-dom';

export default function Splash(props) {

    const { setSnackbar } = props;

  const [hasAccount, setHasAccount] = useState(false);
  const [userBody, setUserBody] = useState({ email: "", username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const { dispatch } = useContext(AuthContext);
  const navigator = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginCall(userBody, dispatch);
      return navigator('/');

    } catch (err) {
      setIsLoading(false);
      return setSnackbar({ isOpen: true, text: `Failed to login. ${err}`, severity: 'error' });
    }
  }

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`${import.meta.env.ENV_SERVER_URL}/user`, userBody);
      await loginCall(userBody, dispatch);
      return navigator('/');

    } catch (err) {
      setIsLoading(false);
      return setSnackbar({ isOpen: true, text: `Failed to create account. ${err}`, severity: 'error' });
    }
  }

  return (
      <Box sx={{ flex: 1, display: "flex", alignItems: "center"}}>
          <Box sx={{ flex: 1, height: "100%", backgroundColor: "primary.main", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Typography variant="h1" color="background.default">Chiffchaff</Typography>
              <img src="logo-icon.png" width="140" />
          </Box>
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", flexDirection: "column" }}>
              {hasAccount ? 
                  <>
                <Typography variant="h3">Login</Typography>
                <form onSubmit={e => handleLoginSubmit(e)}>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                            <FormControl sx={{marginTop: "15px"}}>
                                <InputLabel htmlFor='username'>Username</InputLabel>
                                <Input autoComplete="true" required type="username" id="username" value={userBody.username} onChange={e => setUserBody({...userBody, username: e.target.value})} />
                            </FormControl>
                            <FormControl sx={{marginTop: "10px"}}>
                                <InputLabel htmlFor='password'>Password</InputLabel>
                                <Input autoComplete="true" required type="password" id="password" value={userBody.password} onChange={e => setUserBody({...userBody, password: e.target.value})} />
                        </FormControl>
                      <Button type="submit" variant='contained' sx={{ alignSelf: "flex-end", margin: "10px 0" }} disabled={isLoading}>{isLoading ? <><CircularProgress size={20} />&nbsp;Loading...</> : "Login"}</Button>
                      <Link onClick={() => setHasAccount(false)}>Need an account? Sign up.</Link>
                    </Box>
                </form>
                  </>
                  :
                  <>
                <Typography variant="h3">Sign Up</Typography>
                <form onSubmit={e => handleSignUpSubmit(e)}>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                            <FormControl sx={{marginTop: "15px"}}>
                                <InputLabel htmlFor='email'>Email address</InputLabel>
                                <Input autoComplete="true" autoFocus required type="email" id="email" value={userBody.email} onChange={e => setUserBody({...userBody, email: e.target.value})} />
                            </FormControl>
                            <FormControl sx={{marginTop: "10px"}}>
                                <InputLabel htmlFor='username'>Username</InputLabel>
                                <Input autoComplete="true" required type="username" id="username" value={userBody.username} onChange={e => setUserBody({...userBody, username: e.target.value})} />
                            </FormControl>
                            <FormControl sx={{marginTop: "10px"}}>
                                <InputLabel htmlFor='password'>Password</InputLabel>
                                <Input autoComplete="true" required type="password" id="password" value={userBody.password} onChange={e => setUserBody({...userBody, password: e.target.value})} />
                        </FormControl>
                <Button type="submit" variant='contained' sx={{ alignSelf: "flex-end", margin: "10px 0" }} disabled={isLoading}>{isLoading ? <><CircularProgress size={20} />&nbsp;Loading...</> : "Sign up"}</Button>
                      <Link onClick={() => setHasAccount(true)}>Already have an account? Login.</Link>
                    </Box>
                </form>
                  </>
              }
      </Box>
    </Box>
  )
}
