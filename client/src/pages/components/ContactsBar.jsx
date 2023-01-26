import { Divider, Input, InputAdornment, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'
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
    const [foundUsers, setFoundUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [contactRequests, setContactRequests] = useState([]);
    
    const { user } = useContext(AuthContext);

    const { socket } = props;

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
            setIsLoading(true);
            if (!user.contacts) return;
            let tempContacts = [];
            for (const contactId of user.contacts) {
                try {
                    const res = await axios.get(`${import.meta.env.ENV_SERVER_URL}/user?id=${contactId}`);
                    tempContacts.push(res.data);
                } catch (err) {
                    throw new Error(`Failed to get contacts. ${err}`);
                }
            }
            setContacts([...tempContacts]);
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
      <Box sx={{ display: "flex", flexDirection: "column", padding: "20px 15px" }}>
          <Divider>
              <Typography variant="h6"><PersonSearch />&nbsp;Find Contacts</Typography>
          </Divider>
        <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
        <Input sx={{flex: 1}} startAdornment={
            <InputAdornment position="start">
            <Search />
            </InputAdornment>
        } value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search users" />
        </Box>
        <Box sx={{alignSelf: "flex-start", mt: "10px", mb: "20px"}}>
            {foundUsers.map(foundUser => (
                <UserListItem key={foundUser._id} data={foundUser} socket={props.socket} />
            ))}
          </Box>
          
          <Divider>
              <Typography variant="h6"><EmojiPeople />&nbsp;Contact Requests</Typography>
          </Divider>
        <Box sx={{ alignSelf: "flex-start", mt: "10px", mb: "20px" }}>
            {contactRequests.map(contact => (
                <ContactRequest key={contact._id} data={contact} socket={props.socket} />
            ))}
        </Box>

        <Divider>
            <Typography variant="h6"><Contacts />&nbsp;Your Contacts</Typography>
        </Divider>
        <Box sx={{ alignSelf: "flex-start", mt: "10px", mb: "20px" }}>
            {contacts.map(contact => (
                <UserListItem key={contact._id} data={contact} socket={props.socket} />
            ))}
        </Box>
    </Box>
  )
}

ContactsBar.propTypes = {
    socket: PropTypes.object.isRequired
}