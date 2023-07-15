import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    ApiChangeInviteCode,
    ApiCreateSpace,
    ApiDeleteSpaceMember,
    ApiGetInviteCode, ApiJoinSpace
} from "../../constants";
import {buildErrorMessage, getSafe} from "../../utils";
import TextField from "@mui/material/TextField";
import Button from "@material-ui/core/Button";
import {SMinorDivider} from "./styles";


function changeSpaceAndReload(spaceId) {
    //await new Promise(r => setTimeout(r, 3000));
    localStorage.setItem("spaceId", spaceId)
    // We set local storage variable.
    // Probably, the easiest way to update it in all the components is to reload the page.
    // We assume that user does not switch spaces frequently.
    window.location.reload()
}


function AddSpaceForm() {
    const [spaceName, setSpaceName] = useState("");

    const handleSpaceCreation = async event => {
        event.preventDefault();  // prevent reload
        let response;
        try {

            response = await axios.request({
                method: 'POST',
                url: ApiCreateSpace,
                headers: {'content-type': 'application/json',},
                data: {
                    spaceName: spaceName,
                    spaceMembersIds: [getSafe(localStorage, "userId")],
                },
            })
        } catch (error) {
            alert(buildErrorMessage(error));
            return;
        }

        changeSpaceAndReload(response.data._id)
    }


    return (
        <form>
            <TextField id="invite-code-field" label="Space name" variant="outlined" sx={{marginRight: 1}}
                       size="small"
                       onChange={(e) => setSpaceName(e.target.value)}/>
            <Button variant="contained" onClick={handleSpaceCreation}>Create space</Button>
        </form>
    )
}


function LeaveSpaceButton() {
    const handleSpaceExit = async event => {
        event.preventDefault();  // prevent reload
        let response;
        try {
            response = await axios.request({
                method: 'DELETE',
                url: ApiDeleteSpaceMember,
                headers: {'content-type': 'application/json',},
                data: {
                    spaceId: getSafe(localStorage, "spaceId"),
                    userId: getSafe(localStorage, "userId")
                },
            });
        } catch (error) {
            alert(buildErrorMessage(error));
            return;
        }

        changeSpaceAndReload(response.data._id)
    }

    return (
        <Button variant="contained" onClick={handleSpaceExit}>Leave current space</Button>
    )
}

function InviteCodeComponent() {
    const [inviteCode, setInviteCode] = useState("Not available");

    useEffect(() => {
        async function fetchInviteCode() {
            let response;
            try {
                response = await axios.request({
                    method: 'POST',
                    url: ApiGetInviteCode,
                    headers: {'content-type': 'application/json',},
                    data: {
                        spaceId: getSafe(localStorage, "spaceId"),
                        userId: getSafe(localStorage, "userId")
                    },
                });
            } catch (error) {
                alert(buildErrorMessage(error));
                return;
            }

            setInviteCode(response.data.inviteCode)
        }

        if (localStorage.hasOwnProperty("spaceId")) {
            void fetchInviteCode();
        }
    }, []);


    const handleCodeChange = async event => {
        event.preventDefault();  // prevent reload
        let response;
        try {
            response = await axios.request({
                method: 'PUT',
                url: ApiChangeInviteCode,
                headers: {'content-type': 'application/json',},
                data: {
                    spaceId: getSafe(localStorage, "spaceId"),
                    userId: getSafe(localStorage, "userId")
                },
            });
        } catch (error) {
            alert(buildErrorMessage(error));
            return;
        }
        setInviteCode(response.data.inviteCode)
    }

    return (
        <>
            <p>
                Invite code for the current space:
                <br/>
                {inviteCode}
            </p>
            <Button variant="contained" onClick={handleCodeChange}>
                Generate new invite code
            </Button>
        </>
    )
}

function JoinNewSpace() {
    const [inviteCode, setInviteCode] = useState("");

    const handleSpaceJoin = async event => {
        event.preventDefault();  // prevent reload

        let response;
        try {
            response = await axios.request({
                method: 'POST',
                url: ApiJoinSpace,
                headers: {'content-type': 'application/json',},
                data: {
                    inviteCode: inviteCode,
                    userId: getSafe(localStorage, "userId"),
                },
            })
        } catch (error) {
            alert(buildErrorMessage(error));
            return;
        }

        changeSpaceAndReload(response.data._id)
    }

    return (
        <form>
            <TextField id="invite-code-field" label="Secret code" variant="outlined" sx={{marginRight: 1}}
                       size="small"
                       onChange={(e) => setInviteCode(e.target.value)}/>
            <Button variant="contained" onClick={handleSpaceJoin}>Join space</Button>
        </form>
    )
}

function SpaceManagementComponent() {
    return (
        <>
            <JoinNewSpace/>
            <SMinorDivider/>
            <InviteCodeComponent/>
            <SMinorDivider/>
            <AddSpaceForm/>
            <SMinorDivider/>
            <LeaveSpaceButton/>
        </>
    )
}

export default SpaceManagementComponent;
