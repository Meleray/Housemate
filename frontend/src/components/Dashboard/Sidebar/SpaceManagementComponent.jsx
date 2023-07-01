import React, {useState} from "react";
import axios from "axios";
import {ApiCreateSpaceAndMember, ApiDeleteSpaceMember} from "../../../constants";
import {isError} from "../../../utils";

function AddSpaceForm() {
    const [spaceName, setSpaceName] = useState("");

    const handleSpaceCreation = async event => {
        event.preventDefault();  // prevent reload
        let response = await axios.request({
            method: 'POST',
            url: ApiCreateSpaceAndMember,
            headers: {'content-type': 'application/json',},
            data: {
                spaceName: spaceName,
                userId: localStorage.getItem("userId"),
            },
        })
        //await new Promise(r => setTimeout(r, 3000));

        if (isError(response)) {
            return;
        }
        localStorage.setItem("spaceId", response.data._id)
        // We set local storage variable.
        // Probably, the easiest way to update it in all the components is to reload the page.
        // We assume that user does not switch spaces frequently.
        window.location.reload()
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
        let response = await axios.request({
            method: 'DELETE',
            url: ApiDeleteSpaceMember,
            headers: {'content-type': 'application/json',},
            data: {
                spaceId: localStorage.getItem("spaceId"),
                userId: localStorage.getItem("userId")
            },
        });

        if (isError(response)) {
            return;
        }
        localStorage.removeItem("spaceId")
        // We set local storage variable.
        // Probably, the easiest way to update it in all the components is to reload the page.
        // We assume that user does not switch spaces frequently.
        window.location.reload()
    }

    return (
        <button type="button" onClick={handleSpaceExit}>Leave current space</button>
    )
}

function InviteCodeComponent() {
    return (
        <>
            <button type="button">Generate new invite code</button>
            <p> Code for this space: VeRySeCrEtCoDe </p>
        </>
    )
}

function JoinNewSpace(){
    return (
        <form>
            <input
                type="text"
                placeholder="Secret code"
                onChange={(e) => (null)}
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
