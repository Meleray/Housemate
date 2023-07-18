import React, {useEffect, useState} from "react";
import {ApiFindSpaceMembers, ApiFindSpacesByUserId, router_auth} from "../../constants";
import {getSafe} from "../../utils";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {StarBorder} from "@mui/icons-material";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import {SLayout, SMessageMain} from "../Layout/styles";
import Sidebar from "../Sidebar/Sidebar";


function MembersPage() {
    const [members, setMembers] = useState([]);


    useEffect(() => {
        async function fetchData() {
            const result = await router_auth.request({
                method: 'POST',
                url: ApiFindSpaceMembers,
                headers: {'content-type': 'application/json',},
                data: {spaceId: getSafe(localStorage, "spaceId")},
            });
            setMembers(result.data)
        }

        void fetchData();
        console.log(members)
    }, []);

    function onSelectSpace(space) {
        localStorage.setItem("spaceId", getSafe(space, '_id'));
        localStorage.setItem("isPremium", getSafe(space, 'isPremium'));
        window.location.reload()
    }


    function isYou(userId) {
        if (getSafe(localStorage, "userId") === userId){
            return " (you)"
        }
    }

    return (
        <SLayout>
            <Sidebar/>
            <SMessageMain>
                <Typography variant="h6">Space members:</Typography>
                <br/>

                <List>
                    {members.map((r) =>
                        <ListItem disablePadding key={getSafe(r, "_id")}>
                            <ListItemText>
                                <ListItemIcon>
                                    {getSafe(r, 'isAdmin') && <StarBorder/>}
                                </ListItemIcon>
                                {getSafe(r, "userName")}
                                {isYou(getSafe(r, "_id"))}
                                , email: {getSafe(r, "userEmail")}
                            </ListItemText>
                        </ListItem>
                    )}
                </List>

            </SMessageMain>
        </SLayout>
    )
}

export default MembersPage;