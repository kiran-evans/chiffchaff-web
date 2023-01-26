import { CircularProgress, Divider, Input, InputAdornment, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Contacts, EmojiPeople, PersonSearch, Search } from '@mui/icons-material';
import { useEffect, useState } from 'react'
import axios from 'axios'
import UserListItem from './UserListItem';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import PropTypes from 'prop-types';
import ContactRequest from './ContactRequest';

export default function ContactsBar(props) {

    const [searchQuery, setSearchQuery] = useState("");
    const [foundUsers, setFoundUsers] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [contactRequests, setContactRequests] = useState([]);
    
    const { user } = useContext(AuthContext);

    const { socket, selectedContact, setSelectedContact } = props;

    useEffect(() => {
        socket.on('CONTACT_REQUEST', contactData => {
            setContactRequests([...contactRequests, contactData]);
        });

        return () => {
            socket.off('CONTACT_REQUEST');
        }
    }, []);

    useEffect(() => {
        const getContacts = async () => {
            setIsLoading('CONTACTS');
            if (!user.contacts) return;
            let tempContacts = [];
            for (const contactId of user.contacts) {
                try {
                    const res = await axios.get(`${import.meta.env.ENV_SERVER_URL}/user?id=${contactId}`);
                    tempContacts.push(res.data);
                } catch (err) {
                    setIsLoading(null);
                    throw new Error(`Failed to get contacts. ${err}`);
                }
            }
            setContacts([...tempContacts]);

            if (Object.keys(selectedContact).length === 0) {
                setSelectedContact(tempContacts[0]);
            }

            setIsLoading(null);
        }
        getContacts();
    }, []);

    useEffect(() => {
        if (!searchQuery) return setFoundUsers(null);
        const getUsers = async () => {
            setIsLoading('USERS');
            try {
                const res = await axios.get(`${import.meta.env.ENV_SERVER_URL}/user?many=true&id=${user._id}&username=${searchQuery}`);
                setFoundUsers([...res.data]);
                setIsLoading(null);

            } catch (err) {
                setIsLoading(null);
                throw new Error(`Failed to get users. ${err}`);
            }
        }
        getUsers();
    }, [searchQuery]);
    
    return (
        <Box sx={{flex: 1, display: "flex", flexDirection: "column", padding: "20px 15px", borderRight: "2px solid", borderColor: "background.card" }}>
            <Divider>
                <Typography variant="h6"><PersonSearch />&nbsp;Find Contacts</Typography>
            </Divider>
            <Box sx={{ display: "flex", mt: "10px", mb: "10px", alignItems: "center" }}>
                <Input sx={{flex: 1}} startAdornment={
                    <InputAdornment position="start">
                    <Search />
                    </InputAdornment>
                } value={searchQuery} type="search" onChange={e => setSearchQuery(e.target.value)} placeholder="Search users" />
            </Box>
            <Box sx={{ alignSelf: "flex-start", mb: "40px" }}>
                {isLoading === 'USERS' && <Typography variant="body1"><CircularProgress size={50} />&nbsp;Searching...</Typography>}
                {foundUsers && (foundUsers.length > 0 ?
                    foundUsers.map(foundUser => (
                        <UserListItem key={foundUser._id} data={foundUser} socket={props.socket} />
                    ))
                    :
                    <Typography variant="body1" color="error">No users found</Typography>
                )}
            </Box>
                
            <Divider>
                <Typography variant="h6"><EmojiPeople />&nbsp;Contact Requests</Typography>
            </Divider>
            <Box sx={{ alignSelf: "flex-start", mt: "20px", mb: "40px" }}>
                {contactRequests.map(contact => (
                    <ContactRequest key={contact._id} data={contact} socket={props.socket} />
                ))}
            </Box>

            <Divider>
                <Typography variant="h6"><Contacts />&nbsp;Your Contacts</Typography>
            </Divider>
            <Box sx={{ alignSelf: "flex-start", mt: "20px", mb: "20px" }}>
                {isLoading === 'CONTACTS' && <Typography variant="body1"><CircularProgress size={50} />&nbsp;Loading...</Typography>}
                {contacts.map(contact => (
                    <Box key={contact._id} onClick={() => setSelectedContact(contact)} sx={{cursor: "pointer"}}>
                        <UserListItem data={contact} socket={props.socket} />
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

ContactsBar.propTypes = {
    socket: PropTypes.object.isRequired,
    selectedContact: PropTypes.object.isRequired,
    setSelectedContact: PropTypes.func.isRequired
}