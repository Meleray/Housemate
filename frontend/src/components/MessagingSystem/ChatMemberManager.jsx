import * as React from 'react';
import {useEffect, useState} from "react";
import axios from "axios";
import {ApiAddChatMember, ApiFindChatMembers, ApiFindChatMembersAndNotmembers, ApiFindSpace} from "../../constants";
import {getSafe} from "../../utils";

function ChatMemberManager({chatId}) {
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);  // todo remove?
    const [members, setMembers] = useState([]);
    const [reloadSemaphore, setReloadSemaphore] = useState(0);

    useEffect(() => {
        async function fetchChatMembers() {
            const result = await axios.request({
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
        axios.request({
            method: 'PUT', url: ApiAddChatMember, headers: {'content-type': 'application/json',}, data: {
                chatId: chatId, userId: newMemberId,
            },
        }).then();
    }


    const handleOpen = () => {
        setOpen(!open);
    };

    const chatMemberElement = (member) => {
        if (member.isChatMember) {
            return (<li key={getSafe(member, "_id")}>
                color={getSafe(member, "userPicture")}, {getSafe(member, "userName")}
            </li>)
        }
    }


    const chatNotMemberElement = (member) => {
        if (!member.isChatMember) {
            return (<li className={getSafe(member, "_id") === selectedId ? "list-group-item active" : "active"}
                        key={getSafe(member, "_id")}
                        onClick={() => {
                            requestAddMember(getSafe(member, "_id"));
                            // setSelectedId(getSafe(member, "_id"));  // TODO remove?
                            const newValue = (reloadSemaphore + 1) % 2
                            setReloadSemaphore(newValue)
                        }}
            >
                {getSafe(member, "_id")}
            </li>)
        }
    }

    return (<div>
        Chat members:
        <ul>
            {members.map(r => chatMemberElement(r))}
        </ul>

        <button onClick={handleOpen}>Add member</button>
        {open ? (<ul className="list-group">
            {members.map(r => chatNotMemberElement(r))}
        </ul>) : null}
    </div>);
}

export default ChatMemberManager;
