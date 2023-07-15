import React, {useState} from "react"

import {ApiCreateChat, router_auth} from "../../constants";
import {getSafe} from "../../utils";


function AddChatForm({onChatsChanged}) {
    const [chatName, setChatName] = useState("New chat");

    const handleAddChat = async event => {
        event.preventDefault();  // prevent reload
        event.target.reset();
        let response = await router_auth.request({
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