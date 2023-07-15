import React, {useState} from "react"

import axios from "axios";
import {ApiCreateChat, ApiDeleteSpaceMember} from "../../constants";
import {buildErrorMessage, getSafe} from "../../utils";
import TextField from "@mui/material/TextField";
import Button from "@material-ui/core/Button";
import {newChatField} from "../../componentsIds";


function AddChatForm({onChatsChanged}) {
    const [chatName, setChatName] = useState("");

    const handleAddChat = async (event) => {
        event.preventDefault();  // prevent reload
        try {
            await axios.request({
                method: 'POST',
                url: ApiCreateChat,
                headers: {'content-type': 'application/json',},
                data: {
                    chatName: chatName,
                    spaceId: getSafe(localStorage, "spaceId"),
                    chatMembers: [getSafe(localStorage, "userId")],
                },
            });
        } catch (error) {
            alert(buildErrorMessage(error));
            return;
        }
        document.getElementById(newChatField).value = "";
        setChatName("")
        onChatsChanged();
    }

    return (
        <form>
            <TextField id={newChatField} label="Chat name" variant="outlined" sx={{marginRight: 1}}
                       size="small"
                       onChange={(e) => setChatName(e.target.value)}/>
            <Button variant="contained" onClick={handleAddChat}>Create chat</Button>
        </form>
    )
}

export default AddChatForm;