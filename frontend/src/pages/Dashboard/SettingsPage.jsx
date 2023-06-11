import React from "react";
import PageTitle from "../../components/Dashboard/PageTitle";
import { SLayout, SMain } from "../../components/Dashboard/Layout/styles.js";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar.js";

const SettingsPage = () => {
    return  (
        <SLayout>
            <Sidebar />
            <SMain>
                <PageTitle>Settings Page</PageTitle>
            </SMain>
        </SLayout>
    );
};

export default SettingsPage;