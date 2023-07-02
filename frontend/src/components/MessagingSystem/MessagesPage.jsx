import React, {useState} from 'react';

import { SLayout, SMain } from '../Layout/styles.js';
import Sidebar from '../Sidebar/Sidebar.js';
import ChatList from "./ChatList";
import AddChatForm from "./AddChatForm";
import { SSidebar } from '../Sidebar/styles.js';
import Chat from "./Chat";

const MessagesPage = () => {

    // how to set global variables https://stackoverflow.com/a/58214612/13221007
    localStorage.setItem("userId", "649809ffa2a87a358df69267");  // TODO during the registration

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
