import React, {useState, useEffect} from "react"

import axios from "axios";


function AddChatForm() {
    const [chatName, setChatName] = useState("New chat");

    function fetchData() {
        axios.request({
            method: 'POST',
            url: 'http://localhost:5000/api/add-chat-and-member',
            headers: {'content-type': 'application/json',},
            data: {
                chatName: chatName,
                spaceId: localStorage.getItem("spaceId"),
                userId: localStorage.getItem("userId"),
            },
        });
    }

    return (
        <form onSubmit={fetchData}>
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