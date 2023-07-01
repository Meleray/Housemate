import * as React from 'react';
import {useEffect, useState} from "react";
import axios from "axios";
import {ApiAddChatMember, ApiFindSpace} from "../../constants";

function AddMemberDropDown({chatId}) {
    const [open, setOpen] = useState(false);
    const [inviteMemberList, setInviteMemberList] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);


    useEffect(() => {
        async function fetchData() {
            const result = await axios.request({
                method: 'POST',
                url: ApiFindSpace,
                headers: {'content-type': 'application/json',},
                data: {spaceId: localStorage.getItem("spaceId")},
            });
            setInviteMemberList(result.data.spaceMembers)  // TODO it is a space, not members
        }

        fetchData();
    }, []);

    function requestAddMember(newMemberId) {
        axios.request({
            method: 'PUT',
            url: ApiAddChatMember,
            headers: {'content-type': 'application/json',},
            data: {
                chatId: chatId,
                userId: newMemberId,
            },
        });
    }


    const handleOpen = () => {
        setOpen(!open);
    };

    return (
        <div>
            <button onClick={handleOpen}>Add member</button>
            {open ? (
                <ul className="list-group">
                    {inviteMemberList.map((r, index) =>
                        <li className={selectedIndex === index ? "list-group-item active" : "active"}
                            key={r}
                            onClick={() => {
                                requestAddMember(r)
                                // setSelectedIndex(index);
                                // onSelectChat(r._id); // call an external function
                            }}
                        >
                            {r}
                        </li>
                    )}
                </ul>
            ) : null}
        </div>
    );
}

export default AddMemberDropDown;
