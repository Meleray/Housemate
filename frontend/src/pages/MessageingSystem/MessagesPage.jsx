import React, {useState} from 'react';

import {SLayout, SMain} from "../../components/Dashboard/Layout/styles.js";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar.jsx";
import ChatList from "./ChatList";
import AddChatForm from "./AddChatForm";
import {SSidebar} from "../../components/Dashboard/Sidebar/styles";
import Chat from "./Chat";

const MessagesPage = () => {

    // how to set global variables https://stackoverflow.com/a/58214612/13221007
    localStorage.setItem("userId", "6499c94f15c651d369fe6572");  // TODO during the registration

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
