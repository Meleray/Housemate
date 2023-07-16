import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
<<<<<<< HEAD
import axios from 'axios';
=======
>>>>>>> origin/master
import { useState } from "react";
import TextField from '@mui/material/TextField';
import TaskSelectUser from './TaskSelectUser';
import TaskDateTimePicker from './TaskDatePicker';
<<<<<<< HEAD
import { ApiDeleteTask, ApiFindTasksBySpaceId } from "../../constants";
import { ApiEditTask } from "../../constants";
import { ApiAddTask } from '../../constants';

const useStylesAddTask = makeStyles((theme) => ({
=======
import { ApiDeleteTask, ApiFindTasksBySpaceAndUserId, router_auth} from "../../constants";
import { ApiEditTask } from "../../constants";
import { ApiAddTask } from '../../constants';

const useStyles = makeStyles((theme) => ({
>>>>>>> origin/master
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

export default function AddTaskForm(onTasksChanged) {
<<<<<<< HEAD
  const classes = useStylesAddTask();
=======
  const classes = useStyles();
>>>>>>> origin/master
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [taskName, setTaskName] = useState("");
  const [dateTime, setDateTime] = useState();
<<<<<<< HEAD
  const [assignedUser, setAssignedUser] = useState();
=======
>>>>>>> origin/master
  const [completionStatus, setCompletionStatus] = useState();

  const [tasks, setTasks] = useState([]);

  const handleAddTask = async (event) => {
    event.preventDefault();
  
    try {
<<<<<<< HEAD
      const response = await axios.request({
=======
      const response = await router_auth.request({
>>>>>>> origin/master
        method: 'POST',
        url: ApiAddTask,
        headers: {
          'content-type': 'application/json',
        },
        data: {
<<<<<<< HEAD
          assigned_user: assignedUser,
          start_date: dateTime,
=======
          start_date: "String",
>>>>>>> origin/master
          end_date: "String",
          complexity: "String",
          repetition: "String",
          body: taskName,
          notification_type: "String",
          notification_time: "String",
          admin_approval: "String",
          spaceId: localStorage.getItem("spaceId"),
          completion: false,
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
<<<<<<< HEAD
                <TaskSelectUser setAssignedUser={setAssignedUser} />
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Date and Time
                <TaskDateTimePicker setDateTime={setDateTime} />
=======
                <TaskSelectUser />
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Date and Time
                <TaskDateTimePicker />
>>>>>>> origin/master
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
