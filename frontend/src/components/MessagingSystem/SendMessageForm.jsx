import React, {useState} from "react"

import axios from "axios";
import {ApiSendMessage} from "../../constants";


function SendMessageForm({chatId}) {
    const [messageText, setMessageText] = useState(null);

    function fetchData(e) {
        e.preventDefault();

        axios.request({
            method: 'POST',
            url: ApiSendMessage,
            headers: {'content-type': 'application/json',},
            data: {
                senderId: localStorage.getItem("userId"),
                chatId: chatId,
                messageText: messageText
            },
        }).then(e.target.reset());
    }

    return (
        <form onSubmit={e => fetchData(e)}>
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