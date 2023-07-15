import React, {useEffect, useState} from "react";
import axios from "axios";
import {ApiFindSpacesByUserId} from "../../constants";
import {getSafe} from "../../utils";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";


function SpaceList() {
    const [spaces, setSpaces] = useState([]);


    useEffect(() => {
        async function fetchData() {
            const result = await axios.request({
                method: 'POST',
                url: ApiFindSpacesByUserId,
                headers: {'content-type': 'application/json',},
                data: {userId: getSafe(localStorage, "userId")},
            });
            setSpaces(result.data)
        }

        void fetchData();
    }, []);

    function onSelectSpace(spaceId) {
        localStorage.setItem("spaceId", spaceId);
        window.location.reload(false);
    }

    const emptyMessage = (spaces.length === 0 && <h1>No spaces found</h1>)

    return (
        <div>
            {emptyMessage}

            <List>
                {spaces.map((r) =>
                    <ListItem disablePadding key={getSafe(r, "_id")}>
                        <ListItemButton
                            selected={localStorage.hasOwnProperty('spaceId') && (getSafe(localStorage, 'spaceId') === r._id)}
                            onClick={() => onSelectSpace(getSafe(r, "_id"))}
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