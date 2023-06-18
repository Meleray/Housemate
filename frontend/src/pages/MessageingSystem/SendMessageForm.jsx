import React, {useState, useEffect} from "react"

import axios from "axios";


function SendMessageForm({chatId}) {
    const [messageText, setMessageText] = useState(null);

    function fetchData() {
        axios.request({
            method: 'POST',
            url: 'http://localhost:5000/api/send-message',
            headers: {'content-type': 'application/json',},
            data: {
                senderId: localStorage.getItem("userId"),
                chatId: chatId,
                messageText: messageText
            },
        });
    }

    return (
        <form onSubmit={fetchData}>
            <input
                type="text"
                placeholder="Text"
                onChange={(e) => setMessageText(e.target.value)}
            />
            <button>Send message</button>
        </form>
    )
}

export default SendMessageForm;