import React from "react";
import PageTitle from "../../components/Dashboard/PageTitle";
import { SLayout, SMain } from "../../components/Dashboard/Layout/styles.js";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";

const BillTrackerPage = () => {
    return  (
        <SLayout>
            <Sidebar />
            <SMain>
                <PageTitle>Bill Tracker Page</PageTitle>
            </SMain>
        </SLayout>
    );
};

export default BillTrackerPage;