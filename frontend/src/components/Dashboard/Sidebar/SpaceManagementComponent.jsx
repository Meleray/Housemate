import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    ApiChangeInviteCode,
    ApiCreateSpace,
    ApiDeleteSpaceMember,
    ApiGetInviteCode, ApiJoinSpace
} from "../../../constants";
import {buildErrorMessage} from "../../../utils";


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
                    spaceMembersIds: [localStorage.getItem("userId")],
                },
            })
        } catch (error) {
            alert(buildErrorMessage(error));
            return;
        }

        changeSpaceAndReload(response.data._id)
    }


    return (
        <form onSubmit={handleSpaceCreation}>
            <input
                type="text"
                placeholder="Space name"
                onChange={(e) => setSpaceName(e.target.value)}
            />
            <button>Create new space</button>
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
                    spaceId: localStorage.getItem("spaceId"),
                    userId: localStorage.getItem("userId")
                },
            });
        } catch (error) {
            alert(buildErrorMessage(error));
            return;
        }

        changeSpaceAndReload(response.data._id)
    }

    return (
        <button type="button" onClick={handleSpaceExit}>Leave current space</button>
    )
}

function InviteCodeComponent() {
    const [inviteCode, setInviteCode] = useState("not available");

    useEffect(() => {
        async function fetchInviteCode() {
            let response;
            try {
                response = await axios.request({
                    method: 'POST',
                    url: ApiGetInviteCode,
                    headers: {'content-type': 'application/json',},
                    data: {
                        spaceId: localStorage.getItem("spaceId"),
                    },
                });
            } catch (error) {
                alert(buildErrorMessage(error));
                return;
            }

            setInviteCode(response.data.inviteCode)
        }

        // TODO
        if (localStorage.getItem("spaceId") !== null){
            fetchInviteCode();
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
                    spaceId: localStorage.getItem("spaceId"),
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
            <button type="button" onClick={handleCodeChange}>
                Generate new invite code
            </button>
            <p> Invite code for this space: {inviteCode} </p>
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
                    userId: localStorage.getItem("userId"),
                },
            })
        } catch (error) {
            alert(buildErrorMessage(error));
            return;
        }

        changeSpaceAndReload(response.data._id)
    }

    return (
        <form onSubmit={handleSpaceJoin}>
            <input
                type="text"
                placeholder="Secret code"
                onChange={(e) => setInviteCode(e.target.value)}
            />
            <button>Join space</button>
        </form>
    )
}

function SpaceManagementComponent() {
    return (
        <>
            <JoinNewSpace/>
            <InviteCodeComponent/>
            <AddSpaceForm/>
            <LeaveSpaceButton/>
        </>
    )
}

export default SpaceManagementComponent;
