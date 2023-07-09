import React, {useState} from 'react';

import { SLayout, SMain } from '../Layout/styles.js';
import Sidebar from '../Sidebar/Sidebar.jsx';
import ChatList from "./ChatList";
import AddChatForm from "./AddChatForm";
import { SSidebar } from '../Sidebar/styles.js';
import Chat from "./Chat";

const MessagesPage = () => {

    // how to set global variables https://stackoverflow.com/a/58214612/13221007
    localStorage.setItem("userId", "64a89164ddca489c40d83a8a");  // TODO during the registration

    const [chosenChatId, setChosenChatId] = useState(null);

    return (
        <SLayout>
            <Sidebar/>
            <SSidebar>
                <ChatList onSelectChat={(chatId) => setChosenChatId(chatId)}/>
                <AddChatForm/>
            </SSidebar>
            <SMain>
                {chosenChatId && <Chat chatId={chosenChatId}/>}
            </SMain>
        </SLayout>
    );
};

export default MessagesPage;
