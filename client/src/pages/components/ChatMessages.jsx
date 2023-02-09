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
        <Box sx={{height: "100%", overflowY: "scroll", flex: 1, display: "flex", flexDirection: "column", padding: "20px 20px 0px 20px"}}>
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
            <div id="chatEnd" style={{ paddingBottom: "50px" }} />
        </Box>        
    )
}
