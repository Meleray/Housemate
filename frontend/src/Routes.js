import React from "react";
import { Route, Switch } from 'react-router-dom';
import BillTrackerPage from "./pages/BillTrackerPage";
import SettingsPage from "./pages/SettingsPage";
import MessagesPage from "./pages/MessagesPage";
import ToDoPage from "./pages/ToDoPage";
import LandingPage from "./landing_page/Components/LandingPage.js";

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/">
                <ToDoPage />
            </Route>
            <Route exact path="/messagespage">
                <MessagesPage />
            </Route>
            <Route exact path="/billtrackerpage">
                <BillTrackerPage />
            </Route>
            <Route exact path="/settingspage">
                <SettingsPage />
            </Route>
            <Route exact path="/logout">
                <h1>Logout</h1>
            </Route>
            <Route path="/landingpage">
                <LandingPage />
            </Route>
        </Switch>
    );
};

export default Routes;
