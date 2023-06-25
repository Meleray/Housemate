import React, {useState, useEffect} from "react"

import axios from "axios";
import SendMessageForm from "./SendMessageForm";
import AddMemberDropDown from "./AddMemberDropDown";


function Chat({chatId}) {
    const [messages, setMessages] = useState([]);
    const [chatMembers, setChatMembers] = useState([]);

    async function fetchMessagesChunk() {
        // TODO load old messages
        // console.log(chatId)
        const result = await axios.request({
            method: 'POST',
            url: 'http://localhost:5000/api/get-message-chunk',
            headers: {'content-type': 'application/json',},
            data: {chatId: chatId},
        });
        setMessages(result.data)
    }

    useEffect(() => {
        fetchMessagesChunk();  // update chat immediately after switch
        const interval = setInterval(() => {
            fetchMessagesChunk();
        }, 2000);  // rerender every N seconds
        return () => clearInterval(interval);
    }, [chatId]);


    useEffect(() => {
        async function fetchChatMembers() {
            const result = await axios.request({
                method: 'POST',
                url: 'http://localhost:5000/api/find-chat-members',
                headers: {'content-type': 'application/json',},
                data: {chatId: chatId},
            });
            setChatMembers(result.data.chatMembers)
        }

        fetchChatMembers();
    }, [chatId]);

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
            <div>
                Chat members:
                <ul>
                    {chatMembers.map((r, index) =>
                        <li key={r._id}>
                            color={r.userPicture}, {r.userName}
                        </li>
                    )}
                </ul>
            </div>

            <button type="button" onClick={requestExitChat}>Leave chat</button>
            <AddMemberDropDown chatId={chatId}/>

            {emptyMessage}

            <ul>
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