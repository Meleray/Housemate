import React from "react";
import PageTitle from "../../components/Dashboard/PageTitle.jsx";
import { SLayout, SMain } from "../../components/Dashboard/Layout/styles.js";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar.js";

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
