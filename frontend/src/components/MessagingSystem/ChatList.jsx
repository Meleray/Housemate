import React, {useState, useEffect} from "react"

import axios from "axios";
import {ApiFindChatsBySpaceAndUserId} from "../../constants";
import {buildErrorMessage, getSafe} from "../../utils";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";


function ChatList({onSelectChat, chatsChangedSemaphore}) {
    const [chats, setChats] = useState([]);
    const [selectedId, setSelectedId] = useState(null);


    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.request({
                    method: 'POST',
                    url: ApiFindChatsBySpaceAndUserId,
                    headers: {'content-type': 'application/json',},
                    data: {
                        spaceId: getSafe(localStorage, "spaceId"),
                        userId: getSafe(localStorage, "userId")
                    },
                });
                setChats(response.data)
            } catch (error) {
                alert(buildErrorMessage(error));
            }
        }

        setSelectedId(null);
        void fetchData();
    }, [chatsChangedSemaphore]);

    const emptyMessage = (chats.length === 0 && <h1>There are no chats in this space</h1>)

    return (
        <div>
            {emptyMessage}
            <List>
                {chats.map((r) =>
                    <ListItem disablePadding key={getSafe(r, "_id")}>
                        <ListItemButton
                            selected={selectedId === getSafe(r, "_id") }
                            onClick={() => {
                                setSelectedId(getSafe(r, "_id"));
                                onSelectChat(getSafe(r, "_id")); // call an external function
                            }}
                        >
                            <ListItemText primary={getSafe(r, "chatName")}/>
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </div>
    )
}

export default ChatList;