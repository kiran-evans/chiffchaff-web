import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { refreshUserData } from "../context/UserActions";


export default function Account() {

    const { user, dispatch } = useContext(AuthContext);

    const [newUsername, setNewUsername] = useState(user.username);
    const [newEmail, setNewEmail] = useState(user.email);
    const [newPw1, setNewPw1] = useState("");
    const [newPw2, setNewPw2] = useState("");
    const [password, setPassword] = useState("");
    const [dialog, setDialog] = useState({ isOpen: false, action: null });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            let newBody = {};

            if (newUsername !== user.username) newBody.username = newUsername;
            if (newEmail !== user.email) newBody.email = newEmail;
            if (newPw1) newBody.newPassword = newPw1;
            newBody.password = password;

            const res = await axios.put(`${import.meta.env.ENV_SERVER_URL}/user?id=${user._id.toString()}`, {
                ...newBody
            });

            refreshUserData(res.data, dispatch);
            setIsLoading(false);
            return;

        } catch (err) {
            throw new Error(err.response.data);
        }
    }

    return (
        <Box sx={{padding: "10px 20px", alignSelf: "center"}}>
            <Typography variant="h3">Account</Typography>

            <Typography variant="h4" sx={{margin: "15px 0"}}>Update Account Details</Typography>

            <form onSubmit={(e) => {e.preventDefault(); setDialog({...dialog, isOpen: true})}}>
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

            <form onSubmit={(e) => {e.preventDefault(); setDialog({...dialog, isOpen: true})}}>
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

            <Dialog open={dialog.isOpen} onClose={() => setDialog({ ...dialog, isOpen: false })}>
                <DialogTitle>Enter Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your existing password.
                    </DialogContentText>
                    <form onSubmit={(e) => { e.preventDefault();  handleSubmit()}}>
                        <TextField sx={{mt: "10px"}} required label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialog({...dialog, isOpen: false})} color="error" disabled={isLoading}>Cancel</Button>
                    <Button onClick={() => handleSubmit()} variant="contained" disabled={isLoading}>{isLoading ? <><CircularProgress size={20} />&nbsp;Confirming...</> : 'Confirm'}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
