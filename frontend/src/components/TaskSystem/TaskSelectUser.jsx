import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState, useEffect } from 'react';
import { ApiFindSpace, ApiFindUserById, router_auth } from "../../constants";

export default function TaskSelectUser() {
  const [responsibleUser, setResponsibleUser] = React.useState('');
  const [memberList, setMemberList] = useState([]);

  const handleChange = (event) => {
    setResponsibleUser(event.target.value);
  };

  useEffect(() => {
    async function fetchData() {
      const result = await router_auth.request({
        method: 'POST',
        url: ApiFindSpace,
        headers: { 'content-type': 'application/json' },
        data: { spaceId: localStorage.getItem('spaceId') },
      });
      const members = result.data.spaceMembers;
      console.log("inviteMemberList:", members);

      // Fetch user information for each member
      const memberPromises = members.map(async (member) => {
        const userResult = await router_auth.request({
          method: 'POST',
          url: ApiFindUserById,
          headers: { 'content-type': 'application/json' },
          data: { userId: member.memberId },
        });
        const user = userResult.data;
        return {
          memberId: member.memberId,
          userName: user.userName,
        };
      });

      // Wait for all member promises to resolve
      const memberData = await Promise.all(memberPromises);
      setMemberList(memberData);
      console.log("Member data:", memberData);
    }

    fetchData();
  }, []);

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label"></InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={responsibleUser}
          label=""
          onChange={handleChange}
        >
          {memberList.map((member) => (
            <MenuItem key={member.memberId} value={member.memberId}>
              {member.userName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
