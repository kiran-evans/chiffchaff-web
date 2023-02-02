import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { useContext } from "react";
import { useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";


export default function ChatMessages(props) {

    const { socket, messageIds } = props;

    const { user } = useContext(AuthContext);

    const [messages, setMessages] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getMessages = async () => {
        if (!messageIds) return;
        setIsLoading(true);
        try {
            let tempMessages = [];
            for (const messageId of messageIds) {
                const res = await axios.get(`${import.meta.env.ENV_SERVER_URL}/message?id=${messageId}`);
                tempMessages.push(res.data);
            }
            setMessages([...tempMessages]);
            setIsLoading(false);
        } catch (err) {
            throw new Error(err.response.data);
        }
    }

    useEffect(() => {
        getMessages();
    }, []);

    useEffect(() => {
        setMessages(null);
        getMessages();
    }, [messageIds]);

    useEffect(() => {
        document.getElementById("chatEnd").scrollIntoView();
    }, [messages]);

    useEffect(() => {
        socket.on('ADD_MESSAGE', message => {
            setMessages(messages => [...messages, message]);
        });

        return () => {
            socket.off('ADD_MESSAGE');
        }
    }, []);

    return (
        <Box sx={{height: "100%", overflowY: "scroll", flex: 1, display: "flex", flexDirection: "column", padding: "20px 20px 0px 20px"}}>
            {messages && messages.map(message => (
                <Box key={message._id} sx={{
                    bgcolor: message.senderId === user._id.toString() ? 'background.paper' : 'primary.main',
                    color: message.senderId === user._id.toString() ? 'text.primary' : 'background.default',
                    alignSelf: message.senderId === user._id.toString() ? 'flex-end' : 'flex-start',
                    padding: "10px 15px",
                    borderRadius: "15px",
                    margin: "5px 0px",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <Box>
                        <Typography variant="body1">{message.body}</Typography>
                    </Box>

                    <Box sx={{alignSelf: "flex-end"}}>
                        <Typography variant="body2">{new Date(message.dateSent).toLocaleString('en-GB')}</Typography>
                    </Box>
                </Box>
            ))}
            <div id="chatEnd" style={{ paddingBottom: "50px" }} />
            {isLoading && <Typography variant="body1"><CircularProgress size={25} />&nbsp;Loading messages...</Typography>}
        </Box>        
    )
}
