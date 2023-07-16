<<<<<<< HEAD
import * as React from 'react';
=======
import React from 'react';
>>>>>>> origin/master
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
<<<<<<< HEAD
import { ApiFindSpace, ApiFindUserById } from "../../constants";
import axios from 'axios';
import { useState, useEffect } from 'react';

=======
>>>>>>> origin/master

const useStyles = makeStyles((theme) => ({
  formControl: {
    position: 'absolute',
<<<<<<< HEAD
    top: '15%',
=======
    top: '18%',
>>>>>>> origin/master
    right: '14%',
    minWidth: 100,
    height: 100,
  },
}));

<<<<<<< HEAD
export default function TaskFilter({ onChange, selectedUser }) {
  const classes = useStyles();
  const [responsibleUserFilter, setResponsibleUserFilter] = React.useState('');
  const [memberListUserFilter, setMemberListUserFilter] = useState([{ memberId: 'allUsers', userName: 'All Users' }]);
  
  useEffect(() => {
    async function fetchData() {
      const result = await axios.request({
        method: 'POST',
        url: ApiFindSpace,
        headers: { 'content-type': 'application/json' },
        data: { spaceId: localStorage.getItem('spaceId') },
      });
      const membersTaskFilter = result.data.spaceMembers;
      console.log("inviteMemberList:", membersTaskFilter);

      // Fetch user information for each member
      const memberPromisesTaskFilter = membersTaskFilter.map(async (memberTaskFilter) => {
        const userResultTaskFilter = await axios.request({
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
=======
const TaskFilter = () => {
  const classes = useStyles();
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };
>>>>>>> origin/master

  return (
    <div>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">Filter</InputLabel>
        <Select
<<<<<<< HEAD
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
=======
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={age}
          onChange={handleChange}
          label="Age"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Completed</MenuItem>
          <MenuItem value={20}>Incomplete</MenuItem>
>>>>>>> origin/master
        </Select>
      </FormControl>
    </div>
  );
<<<<<<< HEAD
}
=======
}

export default TaskFilter;
>>>>>>> origin/master
