import React, {useState} from 'react';

import {SLayout, SMessageMain} from '../Layout/styles.js';
import Sidebar from '../Sidebar/Sidebar.jsx';
import ChatList from "./ChatList";
import AddChatForm from "./AddChatForm";
import {SSidebar} from '../Sidebar/styles.js';
import Chat from "./Chat";

const MessagesPage = () => {

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
            <SMessageMain>
                {chosenChatId &&
                    <Chat
                        chatId={chosenChatId}
                        onChatsChanged={() => updateSemaphore()}/>
                }
            </SMessageMain>
        </>
    )


    return (
        <SLayout>
            <Sidebar/>
            {(localStorage.hasOwnProperty("spaceId")) ? messagingSystemPart : "Create, join or select a space"}
        </SLayout>
    );
};

export default MessagesPage;
