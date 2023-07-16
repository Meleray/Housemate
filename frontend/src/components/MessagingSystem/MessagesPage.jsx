import React, {useState} from 'react';

import {SLayout, SMain} from '../Layout/styles.js';
import Sidebar from '../Sidebar/Sidebar.jsx';
import ChatList from "./ChatList";
import AddChatForm from "./AddChatForm";
import {SSidebar} from '../Sidebar/styles.js';
import Chat from "./Chat";
import {getSafe} from "../../utils";

const MessagesPage = () => {

    // how to set global variables https://stackoverflow.com/a/58214612/13221007
    localStorage.setItem("userId", "64b2f227528b9a0b3e1903a3");  // TODO during the registration

    const [chosenChatId, setChosenChatId] = useState(null);
    const [chatsChangedSemaphore, setChatsChangedSemaphore] = useState(0);

    function updateSemaphore() {
        setChatsChangedSemaphore(chatsChangedSemaphore => (chatsChangedSemaphore + 1) % 2)
        setChosenChatId(null)
    }

    const messagingSystemPart = (
        <>
            <SSidebar>
                <ChatList
                    onSelectChat={(chatId) => setChosenChatId(chatId)}
                    chatsChangedSemaphore={chatsChangedSemaphore}/>
                <AddChatForm onChatsChanged={() => updateSemaphore()}/>
            </SSidebar>
            <SMain>
                {chosenChatId &&
                    <Chat
                        chatId={chosenChatId}
                        onChatsChanged={() => updateSemaphore()}/>
                }
            </SMain>
        </>
    )


    return (
        <SLayout>
            <Sidebar/>
            {(localStorage.hasOwnProperty("spaceId") ) ? messagingSystemPart : "Create or join a space"}
        </SLayout>
    );
};

export default MessagesPage;
