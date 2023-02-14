import { Box, Button, CircularProgress, FormControl, TextField, InputLabel, Link, Typography } from '@mui/material'

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
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", flexDirection: "column"}}>
            <Box sx={{ flex: 1, backgroundColor: "primary.main", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography variant="h1" color="background.default">Chiffchaff</Typography>
                <img src="logo-icon.png" style={{width: 30, margin: "0 10px"}} />
            </Box>

            <Box sx={{ flex: 8, display: "flex", alignItems: "center", flexDirection: "column", pt: "40px" }}>
                {hasAccount ? 
                    <>
                <Typography variant="h3">Login</Typography>
                <form onSubmit={e => handleLoginSubmit(e)}>
                    <Box sx={{ display: "flex", flexDirection: "column", mt: "15px" }}>
                        <TextField autoComplete="true" required label="Username" type="username" id="username" value={userBody.username} onChange={e => setUserBody({...userBody, username: e.target.value})} />
                        <TextField sx={{mt: "10px"}} autoComplete="true" required label="Password" type="password" id="password" value={userBody.password} onChange={e => setUserBody({...userBody, password: e.target.value})} />
                        <Button type="submit" variant='contained' sx={{ alignSelf: "flex-end", mt: "10px", mb: "20px" }} disabled={isLoading}>{isLoading ? <><CircularProgress size={20} />&nbsp;Loading...</> : "Login"}</Button>
                        <Link onClick={() => setHasAccount(false)}>Need an account? Sign up.</Link>
                    </Box>
                </form>
                    </>
                    :
                    <>
                <Typography variant="h3">Sign Up</Typography>
                <form onSubmit={e => handleSignUpSubmit(e)}>
                    <Box sx={{display: "flex", flexDirection: "column", mt: "15px"}}>
                        <TextField autoComplete="true" autoFocus required label="Email" type="email" id="email" value={userBody.email} onChange={e => setUserBody({...userBody, email: e.target.value})} />
                        <TextField sx={{mt: "10px"}} autoComplete="true" required label="Username" type="username" id="username" value={userBody.username} onChange={e => setUserBody({...userBody, username: e.target.value})} />
                        <TextField sx={{mt: "10px"}} autoComplete="true" required label="Password" type="password" id="password" value={userBody.password} onChange={e => setUserBody({...userBody, password: e.target.value})} />
                        {userBody.password && 
                            <TextField
                                sx={{mt: "10px"}}
                                autoComplete="true"
                                required
                                label="Repeat password"
                                type="password"
                                id="password"
                                value={userBody.repeatPassword}
                                onChange={e => setUserBody({ ...userBody, repeatPassword: e.target.value })}
                                error={!!(userBody.password && userBody.repeatPassword) && (userBody.password !== userBody.repeatPassword)}
                                helperText={((userBody.password && userBody.repeatPassword) && (userBody.password !== userBody.repeatPassword)) && "Passwords do not match"}
                            />
                        }
                        <Button type="submit" variant='contained' sx={{ alignSelf: "flex-end", mt: "10px", mb: "20px" }} disabled={isLoading}>{isLoading ? <><CircularProgress size={20} />&nbsp;Loading...</> : "Sign up"}</Button>
                        <Link onClick={() => setHasAccount(true)}>Already have an account? Login.</Link>
                    </Box>
                </form>
                    </>
                }
        </Box>
    </Box>
    )
}
