import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, TextField, Tooltip, Typography } from "@mui/material";
import { Archive, DeleteForever, RestartAlt, Unarchive } from '@mui/icons-material'
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { refreshUserData } from "../context/UserActions";


export default function Account(props) {

    const { setSnackbar } = props;

    const { user, dispatch } = useContext(AuthContext);

    const [newUsername, setNewUsername] = useState(user.username);
    const [newEmail, setNewEmail] = useState(user.email);
    const [newPw1, setNewPw1] = useState("");
    const [newPw2, setNewPw2] = useState("");
    const [password, setPassword] = useState("");
    const [dialog, setDialog] = useState({ title: "", isOpen: false, action: null });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (action) => {
        setIsLoading(true);

        switch (action) {
            case 'UPDATE_DETAILS':
                try {
                    let newBody = {};

                    if (newUsername !== user.username) newBody.username = newUsername;
                    if (newEmail !== user.email) newBody.email = newEmail;
                    if (newPw1) newBody.newPassword = newPw1;
                    newBody.password = password;

                    const res = await axios.put(`${import.meta.env.ENV_SERVER_URL}/user?id=${user._id.toString()}`, {
                        ...newBody
                    });

                    setIsLoading(false);
                    setSnackbar({ isOpen: true, severity: "success", text: `Account updated!` });
                    refreshUserData(res.data, dispatch);
                    return;

                } catch (err) {
                    setIsLoading(false);
                    setSnackbar({ isOpen: true, severity: "error", text: err.response.data });
                    return;
                }

            case 'ARCHIVE_ACCOUNT':
                try {
                    const res = await axios.put(`${import.meta.env.ENV_SERVER_URL}/user?id=${user._id.toString()}`, {
                        password: password,
                        isArchived: true
                    });

                    setIsLoading(false);
                    setSnackbar({ isOpen: true, severity: "success", text: `Account archived!` });
                    refreshUserData(res.data, dispatch);
                    return;

                } catch (err) {
                    setIsLoading(false);
                    setSnackbar({ isOpen: true, severity: "error", text: err.response.data });
                    return;
                }

            case 'UNARCHIVE_ACCOUNT':
                try {
                    const res = await axios.put(`${import.meta.env.ENV_SERVER_URL}/user?id=${user._id.toString()}`, {
                        password: password,
                        isArchived: false
                    });

                    setIsLoading(false);
                    setSnackbar({ isOpen: true, severity: "success", text: `Account unarchived!` });
                    refreshUserData(res.data, dispatch);
                    return;

                } catch (err) {
                    setIsLoading(false);
                    setSnackbar({ isOpen: true, severity: "error", text: err.response.data });
                    return;
                }
            
            default:
                setIsLoading(false);
                setSnackbar({ isOpen: true, severity: "error", text: `Not a valid action.` });
                return;
        }
    }

    return (
        <Box sx={{padding: "10px 20px", alignSelf: "center", display: "flex", flexDirection: "column"}}>
            <Typography variant="h3">Account</Typography>

            <Typography variant="h4" sx={{margin: "15px 0"}}>Update Account Details</Typography>

            <form onSubmit={(e) => {e.preventDefault(); setDialog({isOpen: true, title: "Enter Password", action: 'UPDATE_DETAILS'})}}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "background.paper",
                    padding: "20px 15px",
                    borderRadius: "10px",
                    margin: "10px 0"
                }}>
                    <Typography variant="h5" sx={{mb: "20px"}}>User Info</Typography>
                    <TextField sx={{mb: "10px"}} required label="Username" type="username" placeholder={user.username} value={newUsername} onChange={e => setNewUsername(e.target.value)} />
                    <TextField sx={{mb: "10px"}} required label="Email" type="email" placeholder={user.email} value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                    <Button type="submit" variant="contained">Save</Button>
                </Box>
            </form>

            <form onSubmit={(e) => {e.preventDefault(); setDialog({isOpen: true, title: "Enter Password", action: 'UPDATE_DETAILS'})}}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "background.paper",
                    padding: "20px 15px",
                    borderRadius: "10px",
                    margin: "10px 0"
                }}>
                    <Typography variant="h5" sx={{mb: "20px"}}>Change Password</Typography>
                    <TextField sx={{mb: "10px"}} required label="New password" type="password" value={newPw1} onChange={e => setNewPw1(e.target.value)} />
                    <TextField sx={{ mb: "10px" }}
                        error={(newPw1 && newPw2) && (newPw1 !== newPw2)}
                        helperText={((newPw1 && newPw2) && (newPw1 !== newPw2)) && "Passwords do not match"}
                        required
                        label="Repeat new password"
                        type="password"
                        value={newPw2}
                        onChange={e => setNewPw2(e.target.value)} />
                    <Button type="submit" variant="contained">Save</Button>
                </Box>
            </form>

            <Typography variant="h4" sx={{margin: "15px 0"}}>Manage Your Data</Typography>

            <Tooltip arrow
                title={user.isArchived
                    ? `Other users will be able to search for your username.
                        You will be able to send and receive new messages and contact requests.`
                    : `Keep your account details, messages and contacts, but you will not be able to send or receive new messages or contact requests.
                        Other users will not be able to search for your username.`}>
                <Button
                    onClick={() => setDialog({ isOpen: true, title: "Enter Password", action: user.isArchived ? 'UNARCHIVE_ACCOUNT' : 'ARCHIVE_ACCOUNT' })}
                    type="button"
                    variant="outlined"
                    color="warning"
                    sx={{ mb: "10px" }}
                >{user.isArchived ? <><Unarchive />&nbsp;Unarchive Account</> : <><Archive />&nbsp;Archive Account</>}</Button>
            </Tooltip>
            <Tooltip arrow title="Delete all your messages and contacts but keep your account.">
                <Button type="button" variant="outlined" color="error" sx={{mb: "10px"}}><RestartAlt />&nbsp;Reset Account</Button>
            </Tooltip>
            <Tooltip arrow title="Delete your account. You will be able to choose which data is also deleted.">
                <Button type="button" variant="outlined" color="error" sx={{mb: "10px"}}><DeleteForever />&nbsp;Delete Account</Button>
            </Tooltip>



            <Dialog open={dialog.isOpen} onClose={() => setDialog({ ...dialog, isOpen: false })}>
                <DialogTitle>{dialog.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your existing password.
                    </DialogContentText>
                    <form onSubmit={(e) => { e.preventDefault();  handleSubmit(dialog.action)}}>
                        <TextField sx={{mt: "10px"}} required label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialog({...dialog, isOpen: false})} color="error" disabled={isLoading}>Cancel</Button>
                    <Button onClick={() => handleSubmit(dialog.action)} variant="contained" disabled={isLoading}>{isLoading ? <><CircularProgress size={20} />&nbsp;Confirming...</> : 'Confirm'}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
