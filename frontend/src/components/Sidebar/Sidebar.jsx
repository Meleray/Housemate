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
import { ReactComponent as LogoSVG } from "../../images/Housemate.svg";
import { AiOutlineMessage } from "react-icons/ai";
import PersonSearchTwoToneIcon from '@mui/icons-material/PersonSearchTwoTone';
import { MdFormatListBulleted, MdLogout } from "react-icons/md";
import { RiMoneyEuroBoxLine } from 'react-icons/ri';
import SpaceManagementComponent from "./SpaceManagementComponent";
import SpaceList from "./SpaceList";
import { router_auth, ApiLogout } from "../../constants";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import Button from "@material-ui/core/Button";
import {ExpandLess, ExpandMore} from "@mui/icons-material";

const Sidebar = () => {
    const [sidebarOpen] = useState(true);
    const [spacesOpen, setSpacesOpen] = useState(false);

    const { pathname } = useLocation();
    const history = useHistory();

    function handleLogout () {
        router_auth.post(ApiLogout, {}).then(response => {
            history.push('/');
        })
    }

    return (
        <SSidebar isOpen={sidebarOpen}>
            <SLogo>
                <Link to="/">
                    <LogoSVG/>
                </Link>
            </SLogo>
            <SDivider />

            <Button variant="contained" onClick={() => setSpacesOpen(!spacesOpen)}>Change space
                {spacesOpen ? <ExpandLess /> : <ExpandMore />}
            </Button>

            {spacesOpen ? (<>
                <SpaceList/>
                <SpaceManagementComponent/>
            </>) : null}

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
                        <SLinkIcon>{icon}
                        </SLinkIcon>
                        {sidebarOpen && <SLinkLabel>{label}</SLinkLabel>}
                    </SLink>
                </SLinkContainer>
            ))}
            <SLinkContainer key={"Logout"} isActive={pathname === "/"}>
                <SLink to="#" onClick={handleLogout} style={!sidebarOpen ? { width: `fit-content` } : {}}>
                    <SLinkIcon><MdLogout /></SLinkIcon>
                    {sidebarOpen && <SLinkLabel>{"Logout"}</SLinkLabel>}
                </SLink>
            </SLinkContainer>
            <SDivider />
        </SSidebar>
    );
};

const linksArray = [
    {
        label: "Tasks", // label: "Home",
        icon: <MdFormatListBulleted />,
        to: "/task",
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
        icon: <RiMoneyEuroBoxLine />,
        to: "/billtracker",
        notification: 0,
    },
];

const secondaryLinksArray = [
    {
        label: "Space Members",
        icon: <PersonSearchTwoToneIcon />,
        to: "/members",
    }
];

export default Sidebar;

