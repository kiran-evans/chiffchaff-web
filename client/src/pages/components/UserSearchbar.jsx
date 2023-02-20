import { Search } from "@mui/icons-material";
import { Box, CircularProgress, Input, InputAdornment, Typography } from "@mui/material";
import axios from "axios";
import { useContext } from "react";
import { useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import UserSearchResultItem from "./UserSearchResultItem";

export default function UserSearchbar(props) {

    const { user } = useContext(AuthContext);

    const [searchQuery, setSearchQuery] = useState("");
    const [foundUsers, setFoundUsers] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getUsers = async () => {
            if (!searchQuery) return setFoundUsers(null);
            setIsLoading('USERS');
            try {
                const res = await axios.get(`${import.meta.env.ENV_SERVER_URL}/user?many=true&id=${user._id}&username=${searchQuery}`);
                setFoundUsers([...res.data]);

            } catch (err) {
                throw new Error(err.response.data);
            }
            setIsLoading(null);
        }
        getUsers();
    }, [searchQuery]);

    return (
        <>
        <Box sx={{ display: "flex", mt: "10px", mb: "10px", alignItems: "center" }}>
            <Input sx={{flex: 1}} startAdornment={
                <InputAdornment position="start">
                    <Search sx={{color: "text.primary"}} />
                </InputAdornment>
            } value={searchQuery} type="search" onChange={e => setSearchQuery(e.target.value)} placeholder="Search users" />
        </Box>
        <Box sx={{ alignSelf: "flex-start", mb: "40px" }}>
            {isLoading === 'USERS' && <Typography variant="body1"><CircularProgress size={20} />&nbsp;Searching...</Typography>}
            {foundUsers && (foundUsers.length > 0 ?
                foundUsers.map(foundUser => (
                    <UserSearchResultItem key={foundUser._id} data={foundUser} socket={props.socket} />
                ))
                :
                <Typography variant="body1" color="error">No users found</Typography>
            )}
        </Box>
        </>
    )
}
