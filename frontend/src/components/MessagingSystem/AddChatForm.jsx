import React, {useState} from "react"

import axios from "axios";
import {ApiCreateChatAndMember, ApiCreateSpaceAndMember} from "../../constants";


function AddChatForm() {
    const [chatName, setChatName] = useState("New chat");

    const handleAddChat = async event => {
        event.preventDefault();  // prevent reload
        event.target.reset();
        let response = await axios.request({
            method: 'POST',
            url: ApiCreateChatAndMember,                                //The api call for creating chat and member
            headers: {'content-type': 'application/json',},
            data: {
                chatName: chatName,
                spaceId: localStorage.getItem("spaceId"),
                userId: localStorage.getItem("userId"),
            },
        });

        // if (isError(response)) {
        //     return;
        // }
        // TODO update chat list
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