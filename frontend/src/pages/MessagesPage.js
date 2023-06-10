import React from "react";
import PageTitle from "../components/PageTitle";
import { SLayout, SMain } from "../components/Layout/styles.js";
import Sidebar from "../components/Sidebar/Sidebar.js";

const MessagesPage = () => {
    return  (
        <SLayout>
            <Sidebar />
            <SMain>
                <PageTitle>Messages Page</PageTitle>
            </SMain>
        </SLayout>
    );
};

export default MessagesPage;
