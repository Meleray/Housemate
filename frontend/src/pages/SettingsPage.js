import React from "react";
import PageTitle from "../components/PageTitle";
import { SLayout, SMain } from "../components/Layout/styles.js";
import Sidebar from "../components/Sidebar/Sidebar.js";

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
