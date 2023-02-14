import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";


export default function ChatMessages(props) {

    const { socket, messages } = props;

    const { user } = useContext(AuthContext);

    const [displayMessages, setDisplayMessages] = useState([...messages]);

    useEffect(() => {
        document.getElementById("chatEnd").scrollIntoView();
        setDisplayMessages([...messages])
    }, [messages]);

    useEffect(() => {
        socket.on('ADD_MESSAGE', message => {
            setDisplayMessages(displayMessages => [...displayMessages, message]);
        });

        return () => {
            socket.off('ADD_MESSAGE');
        }
    }, []);

    return (
        <Box sx={{
            flex: 40,
            padding: "20px 20px 50px 20px",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto"
        }}>
            {displayMessages.map(message => (
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
                        {message.body ?
                            <Typography variant="body1">{message.body}</Typography>
                            :
                            <Typography sx={{fontStyle: "oblique"}}>This message was deleted.</Typography>
                        }
                    </Box>

                    <Box sx={{alignSelf: "flex-end"}}>
                        <Typography variant="body2">{new Date(message.dateSent).toLocaleString('en-GB')}</Typography>
                    </Box>
                </Box>
            ))}

            <div id="chatEnd" style={{ height: 0 }} />
        </Box>        
    )
}
