import React, {useState, useEffect} from "react"

import axios from "axios";


function AddChatForm() {
    const [chatName, setChatName] = useState("New chat");

    function requestAddChat() {
        axios.request({
            method: 'POST',
            url: 'http://localhost:5001/api/create-chat-and-member',
            headers: {'content-type': 'application/json',},
            data: {
                chatName: chatName,
                spaceId: localStorage.getItem("spaceId"),
                userId: localStorage.getItem("userId"),
            },
        });
    }

    return (
        <form onSubmit={requestAddChat}>
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