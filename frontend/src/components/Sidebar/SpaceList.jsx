import React, {useEffect, useState} from "react";
import {ApiFindSpacesByUserId, router_auth} from "../../constants";
import {getSafe} from "../../utils";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";


function SpaceList() {
    const [spaces, setSpaces] = useState([]);


    useEffect(() => {
        async function fetchData() {
            const result = await router_auth.request({
                method: 'POST',
                url: ApiFindSpacesByUserId,
                headers: {'content-type': 'application/json',},
                data: {userId: getSafe(localStorage, "userId")},
            });
            setSpaces(result.data)
        }

        void fetchData();
    }, []);

    function onSelectSpace(space) {
        localStorage.setItem("spaceId", getSafe(space, '_id'));
        localStorage.setItem("isPremium", getSafe(space, 'isPremium'));
        window.location.reload()
    }

    const emptyMessage = (spaces.length === 0 && <h1>No spaces found</h1>)

    return (
        <div>
            {emptyMessage}

            <List>
                {spaces.map((r) =>
                    <ListItem disablePadding key={getSafe(r, "_id")}>
                        <ListItemButton
                            selected={localStorage.hasOwnProperty('spaceId')
                                && (getSafe(localStorage, 'spaceId') === r._id)}
                            onClick={() => onSelectSpace(r)}
                        >
                            <ListItemText primary={getSafe(r, "spaceName")}/>
                        </ListItemButton>
                    </ListItem>
                )}
            </List>

        </div>
    )
}

export default SpaceList;