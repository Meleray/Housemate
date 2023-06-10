import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    SDivider,
    SLink,
    SLinkContainer,
    SLinkIcon,
    SLinkLabel,
    SLogo,
    SSidebar
} from "./styles";
import { logoSVG } from "../../images";
import { AiOutlineMessage, AiOutlineSetting } from "react-icons/ai";
import { MdFormatListBulleted, MdLogout } from "react-icons/md";
import { RiMoneyEuroBoxLine } from 'react-icons/ri';

const Sidebar = () => {
    const [sidebarOpen] = useState(true);
    const { pathname } = useLocation();

    return (
        <SSidebar isOpen={sidebarOpen}>
            <SLogo>
                <Link to="/">
                    <img src={logoSVG} alt="logo" />
                </Link>
            </SLogo>
            <SDivider />
            {linksArray.map(({ icon, label, to }) => (
                <SLinkContainer key={label} isActive={pathname === to}>
                    <SLink to={to} style={!sidebarOpen ? { width: `fit-content` } : {}}>
                        <SLinkIcon>{icon}</SLinkIcon>
                        {sidebarOpen && (
                            <>
                                <SLinkLabel>{label}</SLinkLabel>
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
                        {sidebarOpen && <SLinkLabel>{label}</SLinkLabel>}
                    </SLink>
                </SLinkContainer>
            ))}
            <SDivider />
        </SSidebar>
    );
};

const linksArray = [
    {
        label: "To-Do", // label: "Home",
        icon: <MdFormatListBulleted />,
        to: "/",
        notification: 0,
    },
    {
        label: "Messages", // label: "Statistics",
        icon: <AiOutlineMessage />,
        to: "/messagespage",
        notification: 0,
    },
    {
        label: "Bill Tracker",
        icon: <RiMoneyEuroBoxLine />,
        to: "/billtrackerpage",
        notification: 0,
    },
];

const secondaryLinksArray = [
    {
        label: "Settings",
        icon: <AiOutlineSetting />,
        to: "/settingspage",
    },
    {
        label: "Logout",
        icon: <MdLogout />,
        to: "/logout",
    },
];

export default Sidebar;

