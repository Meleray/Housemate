import React, {useState, useEffect} from "react"

import axios from "axios";
import SendMessageForm from "./SendMessageForm";


function Chat({chatId}) {
    const [messages, setMessages] = useState([]);


    useEffect(() => {
        async function fetchData() {
            const result = await axios.request({
                method: 'POST',
                url: 'http://localhost:5000/api/get-message-chunk',
                headers: {'content-type': 'application/json',},
                data: {chatId: chatId},
            });
            setMessages(result.data)
        }

        fetchData();
    }, []);

    function requestExitChat() {
        axios.request({
            method: 'DELETE',
            url: 'http://localhost:5000/api/delete-chat-member',
            headers: {'content-type': 'application/json',},
            data: {
                chatId: chatId,
                userId: localStorage.getItem("userId")
            },
        });
    }

    const emptyMessage = (messages.length === 0 && <h1>No messages in this chat</h1>)

    return (
        <div>
            <button type="button" onClick={requestExitChat}>Exit chat</button>

            {emptyMessage}

            <ul className="list-group">
                {messages.map((r, index) =>
                    <li key={r._id}>
                        {r.messageText}, {r.date}
                    </li>
                )}
            </ul>
            <SendMessageForm chatId={chatId}/>
        </div>
    )
}

export default Chat;