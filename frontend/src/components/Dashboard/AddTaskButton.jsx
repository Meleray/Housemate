import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useState} from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '20%',
    right: '60%',
    textAlign: 'center',
  },
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '60%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function AddTaskButton() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [taskDescription, setTaskDescription] = useState()
  const [responsibleUser, setResponsibleUser] = useState()
  const [dateTime, setDateTime] = useState()
  const [completionStatus, setCompletionStatus] = useState()


  function handleFormSubmit(event) {
    event.preventDefault();
    axios.post('http://localhost:5001/api/add-todo',
              {"taskDescription": taskDescription, 
               "responsibleUser": responsibleUser, 
               "dateTime": dateTime, 
               "completionStatus": "Incomplete"}
               ); // Server host, register is the route of the server
  }


  return (
    <div className={classes.root}>
      <Button variant="contained" onClick={handleOpen}>Add Task</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} onSubmit={handleFormSubmit}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Task Description
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Title
            <div />
            <input 
                type="text" 
                id="title"
                onChange={(e) => setTaskDescription(e.target.value)}
                />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Responsible User
            <div />
            <input 
                type="text" 
                id="title" 
                onChange={(e) => setResponsibleUser(e.target.value)}
                />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Date
            <div />
            <input 
                type="text" 
                id="title" 
                onChange={(e) => setDateTime(e.target.value)}
                />
          </Typography>
          <Button onClick={handleOpen}>Add Task</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </Box>
      </Modal>
    </div>
  );
}
