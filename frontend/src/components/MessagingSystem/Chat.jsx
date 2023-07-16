import React, {useState, useEffect} from "react"

import moment from "moment";
import SendMessageForm from "./SendMessageForm";
import ChatMemberManager from "./ChatMemberManager";
import {
    ApiDeleteChatMember,
    ApiLoadMessageChunk,
    ChatUpdateTimeout,
    router_auth
} from "../../constants";
import {buildErrorMessage, getSafe} from "../../utils";
import Button from "@material-ui/core/Button";
import {SMinorDivider} from "../Sidebar/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';


function Chat({chatId, onChatsChanged}) {
    const [messages, setMessages] = useState([]);

    async function loadMessages(selectParam) {
        const result = await router_auth.request({
            method: 'POST',
            url: ApiLoadMessageChunk,
            headers: {'content-type': 'application/json',},
            data: {chatId: chatId, ...selectParam},
        })

        if (selectParam.hasOwnProperty("getOlderThan")) {
            setMessages(messages => [...result.data, ...messages])

        } else if (selectParam.hasOwnProperty("getNewerThan")) {
            setMessages(messages => [...messages, ...result.data])

        } else {
            setMessages(result.data)
        }
    }

    const handleLoadOlderMessages = async event => {
        event.preventDefault();  // prevent reload
        if (messages.length === 0) {
            await loadMessages({})
        } else {
            const oldestTimestamp = messages[0].date
            await loadMessages({getOlderThan: oldestTimestamp})
        }
    }


    useEffect(async () => {
        await loadMessages({});
    }, [chatId]);


    async function loadNewerMessages() {
        if (messages.length === 0) {
            await loadMessages({})
        } else {
            const newestTimestamp = messages.at(-1).date
            await loadMessages({getNewerThan: newestTimestamp})
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            void loadNewerMessages();
        }, ChatUpdateTimeout);  // rerender every N seconds
        return () => clearInterval(interval);
    }, [chatId, messages]);


    const handleLeaveChat = async event => {
        event.preventDefault();  // prevent reload
        try {
            await router_auth.request({
                method: 'DELETE',
                url: ApiDeleteChatMember,
                headers: {'content-type': 'application/json',},
                data: {
                    chatId: chatId,
                    userId: getSafe(localStorage, "userId")
                },
            });
        } catch (error) {
            alert(buildErrorMessage(error));
        }
        onChatsChanged();
    }

    function getSenderName(message) {
        if (message.hasOwnProperty('senderId')) {
            if (message.senderId.hasOwnProperty('_id')
                && (message.senderId._id === getSafe(localStorage, "userId"))) {
                return "Me"
            }
            return getSafe(message, "senderId").userName
        }
        return "System"
    }

    const emptyMessage = (messages.length === 0 && <h1>No messages in this chat</h1>)

    return (
        // <div style={{ display: 'flex', flexDirection: 'column'}}>
        <div>
            <Button variant="contained" onClick={handleLeaveChat}>Leave chat</Button>
            <ChatMemberManager chatId={chatId}/>
            <SMinorDivider/>


            <Box
                sx={{
                    mb: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: '80vh',
                    overflow: "hidden",
                    overflowY: "scroll",
                }}
            >

                <Button variant="contained" onClick={handleLoadOlderMessages}>Load more messages</Button>

                {emptyMessage}

                <List>
                    {messages.map((r) =>
                        <ListItem disablePadding divider key={getSafe(r, "_id")}>
                            <ListItemText>
                                <Typography variant="subtitle1" sx={{display: 'inline'}} component="span" color="green">
                                    {(getSenderName(r))}
                                </Typography>
                                <br/>

                                <Typography variant="caption" sx={{display: 'inline'}} component="span">
                                    at {moment(getSafe(r, "date")).format("ss:mm:hh MM/DD/YYYY")}
                                </Typography>
                                <br/>

                                <Typography variant="body1" sx={{display: 'inline'}} component="span">
                                    {getSafe(r, "messageText")}
                                </Typography>

                            </ListItemText>
                        </ListItem>
                    )}
                </List>
            </Box>

            <SendMessageForm chatId={chatId}/>
        </div>
    )
}

export default Chat;