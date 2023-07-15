import React, {useState} from "react"

import {ApiSendMessage, router_auth} from "../../constants";
import {buildErrorMessage, getSafe} from "../../utils";
import Button from "@material-ui/core/Button";
import TextField from "@mui/material/TextField";
import {newMessageField} from "../../componentsIds";


function SendMessageForm({chatId}) {
    const [messageText, setMessageText] = useState(null);
    const handleSendMessage = async (event) => {
        event.preventDefault();  // prevent reload
        try {
            await router_auth.request({
                method: 'POST',
                url: ApiSendMessage,
                headers: {'content-type': 'application/json',},
                data: {
                    senderId: getSafe(localStorage, "userId"),
                    chatId: chatId,
                    messageText: messageText
                },
            })
        } catch (error) {
            alert(buildErrorMessage(error));
            return;
        }
        document.getElementById(newMessageField).value = "";
        setMessageText("")
    }

    return (
        <form>
            <TextField id={newMessageField} label="Chat name" variant="outlined" sx={{marginRight: 1}}
                       size="small"
                       onChange={(e) => setMessageText(e.target.value)}/>
            <Button variant="contained" onClick={handleSendMessage}>Send message</Button>
        </form>
    )
}

export default SendMessageForm;