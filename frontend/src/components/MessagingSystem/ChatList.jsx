import React, {useState, useEffect} from "react"

import axios from "axios";
import {ApiFindChatsBySpaceAndUserId} from "../../constants";


function ChatList({onSelectChat}) {
    const [chats, setChats] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);


    useEffect(() => {
        async function fetchData() {
            const response = await axios.request({
                method: 'POST',
                url: ApiFindChatsBySpaceAndUserId,
                headers: {'content-type': 'application/json',},
                data: {
                    spaceId: localStorage.getItem("spaceId"),
                    userId: localStorage.getItem("userId")
                },
            });
            // if (isError(response)){
            //     return
            // }
            setChats(response.data)                 // After one finds the data in the database this is the new value stored in the variable chats
        }

        fetchData();                // the fetch data is run
    }, []);

    const emptyMessage = (chats.length === 0 && <h1>No chats found</h1>)

    return (
        <div>
            {emptyMessage}
            <ul className="list-group">                    
                {chats.map((r, index) =>
                    <li className={selectedIndex === index ? "list-group-item active" : "active"}
                        key={r._id}
                        onClick={() => {
                            setSelectedIndex(index);
                            onSelectChat(r._id); // call an external function; this is the declaration of the .id of the chats
                        }}
                    >
                        {r.chatName}
                    </li>
                )}
            </ul>
        </div>
    )
}

export default ChatList;