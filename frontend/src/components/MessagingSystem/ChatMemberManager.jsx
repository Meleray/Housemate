import * as React from 'react';
import {useEffect, useState} from "react";
import {
    ApiAddChatMember, ApiFindChatMembersAndNotmembers, router_auth
} from "../../constants";
import {getSafe} from "../../utils";
import Button from "@material-ui/core/Button";

function ChatMemberManager({chatId}) {
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);  // todo remove?
    const [members, setMembers] = useState([]);
    const [reloadSemaphore, setReloadSemaphore] = useState(0);

    useEffect(() => {
        async function fetchChatMembers() {
            const result = await router_auth.request({
                method: 'POST',
                url: ApiFindChatMembersAndNotmembers,
                headers: {'content-type': 'application/json',},
                data: {chatId: chatId},
            });
            setMembers(result.data)
        }

        void fetchChatMembers();
    }, [chatId, reloadSemaphore]);

    function requestAddMember(newMemberId) {
        router_auth.request({
            method: 'PUT',
            url: ApiAddChatMember,
            headers: {'content-type': 'application/json',},
            data: {
                chatId: chatId, newMemberId: newMemberId,
            },
        }).then();
    }


    const handleOpen = () => {
        setOpen(!open);
    };

    const chatMemberElement = (member) => {
        if (member.isChatMember) {
            return (<li key={getSafe(member, "_id")}>
                {getSafe(member, "userName")}
            </li>)
        }
    }


    const chatNotMemberElement = (member) => {
        if (!member.isChatMember) {
            return (<li key={getSafe(member, "_id")} style={{textDecoration: 'underline'}}
                        onClick={() => {
                            requestAddMember(getSafe(member, "_id"));
                            // setSelectedId(getSafe(member, "_id"));  // TODO remove?
                            const newValue = (reloadSemaphore + 1) % 2
                            setReloadSemaphore(newValue)
                        }}
            >
                {getSafe(member, "userName")}
            </li>)
        }
    }

    return (
        <div>
            <br/>
            <Button variant="contained" onClick={handleOpen}>Chat members</Button>

            {open ? (<>
                <ul> {members.map(r => chatMemberElement(r))} </ul>
                You can add the following people to the chat:
                <ul> {members.map(r => chatNotMemberElement(r))} </ul>
            </>) : null}
        </div>
    );
}

export default ChatMemberManager;
