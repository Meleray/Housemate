import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useState } from "react";
import TextField from '@mui/material/TextField';
import TaskSelectUser from './TaskSelectUser';
import TaskDateTimePicker from './TaskDatePicker';

import { ApiAddTask } from '../../constants';

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

export default function AddTaskForm() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [taskName, setTaskName] = useState("");
  const [dateTime, setDateTime] = useState();
  const [completionStatus, setCompletionStatus] = useState();

  const handleAddTask = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.request({
        method: 'POST',
        url: ApiAddTask,
        headers: {
          'content-type': 'application/json',
        },
        data: {
          start_date: "String",
          end_date: "String",
          complexity: "String",
          repetition: "String",
          body: taskName,
          notification_type: "String",
          notification_time: "String",
          admin_approval: "String",
          spaceId: localStorage.getItem("spaceId"),
        },
      });
  
      // Form submission is complete, close the modal
      handleClose();
    } catch (error) {
      // Handle error, if any
      console.error(error);
    }
  };
  

  return (
    <div className={classes.root}>
      <Button variant="contained" onClick={handleOpen}>Add Task</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Task Description
          </Typography>
          <form onSubmit={handleAddTask}>
            <div>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <div>
                  <p>Task Name</p>
                  <TextField
                    fullWidth
                    id="taskName"
                    value={taskName}
                    onChange={(event) => setTaskName(event.target.value)}
                  />
                </div>
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Responsible User
                <TaskSelectUser />
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Date and Time
                <TaskDateTimePicker />
              </Typography>
              <div style={{ display: 'flex', gap: '175px', marginTop: '30px' }}>
                <Button type="submit" >Add Task</Button>
                <Button onClick={handleClose}>Cancel</Button>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
  
}
