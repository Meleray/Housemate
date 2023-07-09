import React from "react";
import PageTitle from "../Layout/PageTitle";
import { SLayout, SMain } from "../Layout/styles.js";
import Sidebar from "../Sidebar/Sidebar";

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