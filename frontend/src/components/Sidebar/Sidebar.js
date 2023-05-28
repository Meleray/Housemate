import React, { useContext, useRef, useState } from "react";
import {
    SDivider,
    SLink,
    SLinkContainer,
    SLinkIcon,
    SLinkLabel,
    SLinkNotification,
    SLogo,
    SSearch,
    SSearchIcon,
    SSidebar,
    SSidebarButton,
    STheme,
    SThemeLabel,
    SThemeToggler,
    SToggleThumb,
} from "./styles";

import { logoSVG } from "../../assets";

import {
    AiOutlineApartment,
    AiOutlineHome,
    AiOutlineLeft,
    AiOutlineSearch,
    AiOutlineSetting,
    AiOutlineMessage
} from "react-icons/ai";
import { MdLogout, MdOutlineAnalytics, MdFormatListBulleted } from "react-icons/md";
import { BsPeople, BsListTask, BsReceipt } from "react-icons/bs";
import { CiMoneyBill } from "react-icons/ci";

import {RiBillLine} from "react-icons/ri";

import { ThemeContext } from "./../../App";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
    const searchRef = useRef(null);
    const { setTheme, theme } = useContext(ThemeContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { pathname } = useLocation();

    const searchClickHandler = () => {
        if (!sidebarOpen) {
            setSidebarOpen(true);
            searchRef.current.focus();
        } else {
            // search functionality
        }
    };

    return (
        <SSidebar>
            <>
            </>
            <SLogo>
                <img src={logoSVG} alt="logo" />
            </SLogo>
            <SDivider />
            {linksArray.map(({ icon, label, notification, to }) => (
                <SLinkContainer key={label} isActive={pathname === to}>
                    <SLink to={to} style={!sidebarOpen ? { width: `fit-content` } : {}}>
                        <SLinkIcon>{icon}</SLinkIcon>
                        {(
                            <>
                                <SLinkLabel>{label}</SLinkLabel>
                                {/* if notifications are at 0 or null, do not display */}
                                {!!notification && (
                                    <SLinkNotification>{notification}</SLinkNotification>
                                )}
                            </>
                        )}
                    </SLink>
                </SLinkContainer>
            ))}
            <SDivider />
            {secondaryLinksArray.map(({ icon, label, to }) => (
                <SLinkContainer key={label} isActive={pathname === to}>
                    <SLink to={to} style={!sidebarOpen ? { width: `fit-content` } : {}}>
                        <SLinkIcon>{icon}</SLinkIcon>
                        {<SLinkLabel>{label}</SLinkLabel>}
                    </SLink>
                </SLinkContainer>
            ))}
            <SDivider />
        </SSidebar>
    );
};

const linksArray = [
    {
        label: "Tasks", // label: "Home",
        icon: <MdFormatListBulleted />,
        to: "/",
        notification: 0,
    },
    {
        label: "Messages", // label: "Statistics",
        icon: <AiOutlineMessage />,
        to: "/messages",
        notification: 0,
    },
    {
        label: "Bill Tracker",
        icon: <CiMoneyBill />,
        to: "/bill_tracker",
        notification: 0,
    },
    /* {
        label: "Diagrams",
        icon: <AiOutlineApartment />,
        to: "/diagrams",
        notification: 1,
    },
    */
];

const secondaryLinksArray = [
    {
        label: "Settings",
        icon: <AiOutlineSetting />,
        to: "/settings",
    },
    {
        label: "Logout",
        icon: <MdLogout />,
        to: "/logout",
    },
];

export default Sidebar;





// Removed code
/* <SSearch
    onClick={searchClickHandler}
    style={!sidebarOpen ? { width: `fit-content` } : {}}
>
    <SSearchIcon>
        <AiOutlineSearch />
    </SSearchIcon>
    <input
        ref={searchRef}
        placeholder="Search"
        style={!sidebarOpen ? { width: 0, padding: 0 } : {}}
    />
</SSearch>
*/

/*
<img src={logoSVG} alt="logo" />
*/

/* line 56
                <SSidebarButton isOpen={sidebarOpen} onClick={() => setSidebarOpen((p) => !p)}>
                    <AiOutlineLeft />
                </SSidebarButton>
*/

/*
            <STheme>
                {sidebarOpen && <SThemeLabel>Dark Mode</SThemeLabel>}
                <SThemeToggler
                    isActive={theme === "dark"}
                    onClick={() => setTheme((p) => (p === "light" ? "dark" : "light"))}
                >
                    <SToggleThumb style={theme === "dark" ? { right: "1px" } : {}} />
                </SThemeToggler>
            </STheme>
*/