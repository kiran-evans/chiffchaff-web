import { Divider, Input, InputAdornment, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'
import { Contacts, Search } from '@mui/icons-material';
import { useEffect, useState } from 'react'
import axios from 'axios'
import UserListItem from './UserListItem';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function ContactsBar() {

    const [searchQuery, setSearchQuery] = useState("");
    const [foundUsers, setFoundUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [contacts, setContacts] = useState([]);
    
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const getContacts = async () => {
            if (!user.contacts) return;
            setIsLoading(true);
            await user.contacts.forEach(async contactId => {
                try {
                    const res = await axios.get(`${import.meta.env.ENV_SERVER_URL}/user?id=${contactId}`);
                    setContacts([...contacts, res.data]);

                } catch (err) {
                    throw new Error(`Failed to get contacts. ${err}`);
                }
            });
            setIsLoading(false);
        }
        getContacts();
    }, []);

    useEffect(() => {
        if (!searchQuery) return setFoundUsers([]);
        const getUsers = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`${import.meta.env.ENV_SERVER_URL}/user?many=true&id=${user._id}&username=${searchQuery}`);
                setFoundUsers([...res.data]);
                
                setIsLoading(false);

            } catch (err) {
                throw new Error(`Failed to get users. ${err}`);
            }
        }
        getUsers();
    }, [searchQuery]);
    
  return (
    <Box sx={{ display: "flex", flexDirection: "column", padding: "20px 15px"}}>
        <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
        <Input sx={{flex: 1}} startAdornment={
            <InputAdornment position="start">
            <Search />
            </InputAdornment>
        } value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search users" />
        </Box>
        <Box sx={{alignSelf: "flex-start", mt: "10px", mb: "20px"}}>
            {foundUsers.map(foundUser => (
                <UserListItem key={foundUser._id} data={foundUser} />
            ))}
        </Box>

        <Divider>
            <Typography variant="h6"><Contacts />&nbsp;Your Contacts</Typography>
        </Divider>
        <Box sx={{ alignSelf: "flex-start", mt: "10px", mb: "20px" }}>
            {contacts.map(contact => (
                <UserListItem key={contact._id} data={contact} />
            ))}
        </Box>
    </Box>
  )
}
