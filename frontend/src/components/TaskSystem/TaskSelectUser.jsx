import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState, useEffect } from 'react';
import { ApiFindSpace, ApiFindSpaceMembers, ApiFindUserById, router_auth } from "../../constants";
import { getSafe } from "../../utils";

export default function TaskSelectUser({ setAssignedUser }) {
  const [responsibleUser, setResponsibleUser] = React.useState('');
  const [memberList, setMemberList] = useState([]);

  const handleChange = (event) => {
    const selectedUserId = event.target.value;
    setResponsibleUser(selectedUserId);
    setAssignedUser(selectedUserId);
  };

  useEffect(() => {
    async function fetchUserData() {
      const result = await router_auth.request({
        method: 'POST',
        url: ApiFindSpaceMembers,
        headers: {'content-type': 'application/json',},
        data: {spaceId: getSafe(localStorage, "spaceId")},
      });
      // setMemberListUserFilter(result.data);
      console.log("Member data:", result.data);
      setMemberList(result.data)
      console.log(memberList)
      }
      void fetchUserData();
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
            <MenuItem key={member._id} value={member._id}>
              {member.userName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
