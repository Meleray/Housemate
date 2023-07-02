import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function TaskSelectUser() {
  const [responsibleUser, setResponsibleUser] = React.useState('');

  const handleChange = (event) => {
    setResponsibleUser(event.target.value);
  };

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
          <MenuItem value={"User 1"}>User 1</MenuItem>
          <MenuItem value={"User 2"}>User 2</MenuItem>
          <MenuItem value={"User 3"}>User 3</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}