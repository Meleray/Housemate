import React, {useState} from "react"

import axios from "axios";
import {ApiCreateChat} from "../../constants";
import {getSafe} from "../../utils";


function AddChatForm({onChatsChanged}) {
    const [chatName, setChatName] = useState("New chat");

    const handleAddChat = async event => {
        event.preventDefault();  // prevent reload
        event.target.reset();
        let response = await axios.request({
            method: 'POST',
            url: ApiCreateChat,
            headers: {'content-type': 'application/json',},
            data: {
                chatName: chatName,
                spaceId: getSafe(localStorage, "spaceId"),
                chatMembers: [getSafe(localStorage, "userId")],
            },
        });
        onChatsChanged();

        // if (isError(response)) {
        //     return;
        // }
    }

    return (
        <form onSubmit={handleAddChat}>
            <input
                type="text"
                placeholder="Chat name"
                onChange={(e) => setChatName(e.target.value)}
            />
            <button>Create new chat</button>
        </form>
    )
}

export default AddChatForm;