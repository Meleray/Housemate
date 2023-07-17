import * as React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import { ApiFindSpace, ApiFindUserById, router_auth } from "../../constants";
import { useState, useEffect } from 'react';


const useStyles = makeStyles((theme) => ({
  formControl: {
    position: 'absolute',
    top: '15%',
    right: '14%',
    minWidth: 100,
    height: 100,
  },
}));

export default function TaskFilter({ onChange, selectedUser }) {
  const classes = useStyles();
  const [responsibleUserFilter, setResponsibleUserFilter] = React.useState('');
  const [memberListUserFilter, setMemberListUserFilter] = useState([{ memberId: 'allUsers', userName: 'All Users' }]);
  
  useEffect(() => {
    async function fetchData() {
      const result = await router_auth.request({
        method: 'POST',
        url: ApiFindSpace,
        headers: { 'content-type': 'application/json' },
        data: { spaceId: localStorage.getItem('spaceId') },
      });
      const membersTaskFilter = result.data.spaceMembers;
      console.log("inviteMemberList:", membersTaskFilter);

      // Fetch user information for each member
      const memberPromisesTaskFilter = membersTaskFilter.map(async (memberTaskFilter) => {
        const userResultTaskFilter = await router_auth.request({
          method: 'POST',
          url: ApiFindUserById,
          headers: { 'content-type': 'application/json' },
          data: { userId: memberTaskFilter.memberId },
        });
        const userTaskFilter = userResultTaskFilter.data;
        return {
          memberId: memberTaskFilter.memberId,
          userName: userTaskFilter.userName,
        };
      });

      // Wait for all member promises to resolve
      const memberDataTaskFilter = await Promise.all(memberPromisesTaskFilter);
      const allUserOption = { memberId: 'off', userName: 'All User' };
      setMemberListUserFilter([allUserOption, ...memberDataTaskFilter]);
      console.log("Member data:", memberDataTaskFilter);
    }

    fetchData();
  }, []);

  return (
    <div>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">Filter</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedUser}
          onChange={onChange}
          label=""
        >
          {memberListUserFilter.map((memberTaskFilter) => (
            <MenuItem key={memberTaskFilter.memberId} value={memberTaskFilter.memberId}>
              {memberTaskFilter.userName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}