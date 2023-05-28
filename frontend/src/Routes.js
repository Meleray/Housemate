import React from 'react';
import {Route, Switch} from "react-router-dom";
import HomePage from "./pages/HomePage";

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/">
                <HomePage />
            </Route>
            <Route exact path="/messages">
                <h1>Messages</h1>
            </Route>
            <Route exact path="/bill_tracker">
                <h1>Bill Tracker</h1>
            </Route>
            <Route exact path="/settings">
                <h1>Settings</h1>
            </Route>
            <Route exact path="/logout">
                <h1>Logout</h1>
            </Route>
        </Switch>
    );
};


export default Routes;