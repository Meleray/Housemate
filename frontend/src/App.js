import React, { useState } from "react";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "styled-components";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { GlobalStyle } from "./components/Dashboard/styles/globalStyles";
import { lightTheme, darkTheme } from "./components/Dashboard/styles/theme";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import LoginPage from "./pages/LandingPage/Login";
import RegisterPage from "./pages/LandingPage/Register";
import BillTrackerPage from './pages/Dashboard/BillTrackerPage';
import MessagesPage from './pages/MessageingSystem/MessagesPage';
import SettingsPage from './pages/Dashboard/SettingsPage';
import ToDoPage from "./pages/Dashboard/ToDoPage";

export const ThemeContext = React.createContext(null);

const App = () => {
  const [theme, setTheme] = useState("light");
  const themeStyle = theme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ setTheme, theme }}>
      <ThemeProvider theme={themeStyle}>
        <GlobalStyle />
        <HelmetProvider>
        <Helmet>
          <title>Housemate</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
        </Helmet>
        </HelmetProvider>
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <LandingPage />
            </Route>
            <Route exact path="/login">
              <LoginPage />
            </Route>
            <Route exact path="/register">
              <RegisterPage />
            </Route>
            <Route exact path="/billtracker">
              <BillTrackerPage />
            </Route>
            <Route exact path="/messages">
              <MessagesPage />
            </Route>
            <Route exact path="/todo">
              <ToDoPage />
            </Route>
            <Route exact path="/settings">
              <SettingsPage />
            </Route>
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default App;
