import React from "react";
import PageTitle from "./Layout/PageTitle";
import { SLayout,SMain } from "./Layout/styles";
import Sidebar from "./Sidebar/Sidebar";

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