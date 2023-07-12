import React, {useState} from 'react';

import {SLayout, SMain} from "../../components/Dashboard/Layout/styles.js";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar.jsx";
import ChatList from "./ChatList";
import AddChatForm from "./AddChatForm";
import {SSidebar} from "../../components/Dashboard/Sidebar/styles";
import Chat from "./Chat";

const MessagesPage = () => {

    // how to set global variables https://stackoverflow.com/a/58214612/13221007
    localStorage.setItem("userId", "64aeb17d8d16877604f147d9");  // TODO during the registration

    const [chosenChatId, setChosenChatId] = useState(null);
    const [chatsChangedSemaphore, setChatsChangedSemaphore] = useState(0);

    function updateSemaphore() {
        setChatsChangedSemaphore(chatsChangedSemaphore => (chatsChangedSemaphore + 1) % 2)
        setChosenChatId(null)
    }


    return (
        <SLayout>
            <Sidebar/>
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
                        onChatsChanged={() => updateSemaphore()}/>}
            </SMain>
        </SLayout>
    );
};

export default MessagesPage;
