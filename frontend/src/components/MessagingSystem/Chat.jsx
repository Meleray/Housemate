import React, {useState, useEffect} from "react"

import moment from "moment";
import axios from "axios";
import SendMessageForm from "./SendMessageForm";
import ChatMemberManager from "./ChatMemberManager";
import {
    ApiDeleteChatMember,
    ApiLoadMessageChunk,
    ChatUpdateTimeout
} from "../../constants";
import {buildErrorMessage, getSafe} from "../../utils";


function Chat({chatId, onChatsChanged}) {
    const [messages, setMessages] = useState([]);

    async function loadMessages(selectParam) {
        const result = await axios.request({
            method: 'POST',
            url: ApiLoadMessageChunk,
            headers: {'content-type': 'application/json',},
            data: {chatId: chatId, ...selectParam},
        })

        if (selectParam.hasOwnProperty("getOlderThan")) {
            setMessages(messages => [...result.data, ...messages])

        } else if (selectParam.hasOwnProperty("getNewerThan")) {
            setMessages(messages => [...messages, ...result.data])

        } else {
            setMessages(result.data)
        }
    }

    const handleLoadOlderMessages = async event => {
        event.preventDefault();  // prevent reload
        if (messages.length === 0) {
            await loadMessages({})
        } else {
            const oldestTimestamp = messages[0].date
            await loadMessages({getOlderThan: oldestTimestamp})
        }
    }


    useEffect(async () => {
        await loadMessages({});
    }, [chatId]);


    async function loadNewerMessages() {
        if (messages.length === 0) {
            await loadMessages({})
        } else {
            const newestTimestamp = messages.at(-1).date
            await loadMessages({getNewerThan: newestTimestamp})
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            void loadNewerMessages();
        }, ChatUpdateTimeout);  // rerender every N seconds
        return () => clearInterval(interval);
    }, [chatId, messages]);


    const handleLeaveChat = async event => {
        event.preventDefault();  // prevent reload
        try {
            await axios.request({
                method: 'DELETE',
                url: ApiDeleteChatMember,
                headers: {'content-type': 'application/json',},
                data: {
                    chatId: chatId,
                    userId: localStorage.getItem("userId")
                },
            });
        } catch (error) {
            alert(buildErrorMessage(error));
        }
        onChatsChanged();
    }


    const emptyMessage = (messages.length === 0 && <h1>No messages in this chat</h1>)

    return (
        <div>
            <button type="button" onClick={handleLeaveChat}>Leave chat</button>
            <ChatMemberManager chatId={chatId}/>
            <button type="button" onClick={handleLoadOlderMessages}>Load more messages</button>

            {emptyMessage}
            <ul>
                {messages.map(r =>
                    <li key={getSafe(r, "_id")}>
                        time: {moment(getSafe(r, "date")).format("ss:mm:hh MM/DD/YYYY")}
                        <br/>
                        sender: {getSafe(r, "senderId").userName}
                        <br/>
                        text: {getSafe(r, "messageText")}
                    </li>
                )}
            </ul>

            <SendMessageForm chatId={chatId}/>
        </div>
    )
}

export default Chat;