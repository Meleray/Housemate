<<<<<<< HEAD
=======
import React, { useState, useEffect } from "react";
>>>>>>> origin/master
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
<<<<<<< HEAD
import axios from "axios";
import { ApiDeleteTask, ApiFindTasksBySpaceId, ApiEditTask, ApiUpdateTaskCompletion, ApiFindUserById, ApiAddTask } from "../../constants";
=======
import { ApiDeleteTask, ApiFindTasksBySpaceAndUserId, ApiEditTask, ApiUpdateTaskCompletion, router_auth} from "../../constants";
>>>>>>> origin/master
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@material-ui/core/Button';
<<<<<<< HEAD
import TaskSelectUser from './TaskSelectUser';
import TaskDateTimePicker from './TaskDatePicker';
import InfoIcon from '@mui/icons-material/Info';
import TaskFilter from "./TaskFilter";
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect, useCallback } from "react";

const useStylesAddTask = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '15%',
    right: '60%',
    textAlign: 'center',
  },
}));
=======

>>>>>>> origin/master

export default function TaskListContainer() {
  const [tasks, setTasks] = useState([]);
  const [taskSelectedIndex, setTaskSelectedIndex] = useState(-1);
  const [openEditModal, setOpenEditModal] = useState(false);
<<<<<<< HEAD
  const [openShowTaskDetailsModal, setOpenShowTaskDetailsModal] = useState(false);
  const [checked, setChecked] = useState([]);
  const [editTaskId, setEditTaskId] = useState('');
  const [editTaskName, setEditTaskName] = useState('');
  const [editAssignedUser, setEditAssignedUser] = useState('');
  const [editDateTime, setEditDateTime] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [editTaskAssignedUserName, setEditTaskAssignedUserName] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [assignedUserName, setAssignedUserName] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filteredCompletedTasks, setFilteredCompletedTasks] = useState([]);
  const [selectedUser, setSelectedUser] = useState('off');

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [taskName, setTaskName] = useState('');
  const [dateTime, setDateTime] = useState();
  const [assignedUser, setAssignedUser] = useState();
=======
  const [checked, setChecked] = useState([]);
  const [editTaskId, setEditTaskId] = useState('');
  const [editTaskName, setEditTaskName] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);

>>>>>>> origin/master

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    async function fetchData() {
      try {
<<<<<<< HEAD
        const response = await axios.request({
          method: 'POST',
          url: ApiFindTasksBySpaceId,
          headers: { 'content-type': 'application/json' },
          data: {
            spaceId: localStorage.getItem('spaceId'),
          },
        });

        const allTasks = response.data;
        const incompleteTasks = allTasks.filter((task) => !task.completion);
        const completedTasks = allTasks.filter((task) => task.completion);

        setTasks(incompleteTasks);
        setFilteredTasks(incompleteTasks);
        setCompletedTasks(completedTasks);
        setFilteredCompletedTasks(completedTasks);
=======
        const response = await router_auth.request({
          method: 'POST',
          url: ApiFindTasksBySpaceAndUserId,
          headers: { 'content-type': 'application/json' },
          data: {
            spaceId: localStorage.getItem("spaceId")
          },
        });
  
        const allTasks = response.data;
        const incompleteTasks = allTasks.filter(task => !task.completion);
        const completedTasks = allTasks.filter(task => task.completion);
  
        setTasks(incompleteTasks);
        setCompletedTasks(completedTasks);
>>>>>>> origin/master
      } catch (error) {
        console.error(error);
      }
    }
<<<<<<< HEAD

    fetchData();
  }, []);

  const handleAddTask = useCallback(async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.request({
        method: 'POST',
        url: ApiAddTask,
        headers: {
          'content-type': 'application/json',
        },
        data: {
          assigned_user: assignedUser,
          start_date: dateTime,
          end_date: 'String',
          complexity: 'String',
          repetition: 'String',
          body: taskName,
          notification_type: 'String',
          notification_time: 'String',
          admin_approval: 'String',
          spaceId: localStorage.getItem('spaceId'),
          completion: false,
        },
      });
  
      // Form submission is complete, close the modal
      handleClose();
  
      // Fetch the newly added task from the API using its ID
      const newTaskId = response.data._id;
      const newTaskResponse = await axios.request({
        method: 'POST',
        url: ApiFindTasksBySpaceId,
        headers: { 'content-type': 'application/json' },
        data: {
          spaceId: localStorage.getItem('spaceId'),
        },
      });
  
      const newTaskList = newTaskResponse.data;
      const newTask = newTaskList.find((task) => task._id === newTaskId);
  
      // Update the tasks state with the new task
      setTasks((prevTasks) => [...prevTasks, newTask]);
  
      // Update filtered tasks based on the selected user
      if (selectedUser === 'off' || selectedUser === newTask.assigned_user) {
        setFilteredTasks((prevTasks) => [...prevTasks, newTask]);
      }
  
      // Update completed tasks if necessary
      if (newTask.completion) {
        setCompletedTasks((prevTasks) => [...prevTasks, newTask]);
  
        if (selectedUser === 'off' || selectedUser === newTask.assigned_user) {
          setFilteredCompletedTasks((prevTasks) => [...prevTasks, newTask]);
        }
      }
    } catch (error) {
      // Handle error, if any
      console.error(error);
    }
  }, [assignedUser, dateTime, taskName, selectedUser, handleClose]);
  
  
=======
  
    fetchData();
  }, []);

>>>>>>> origin/master
  const handleToggle = (task) => async () => {
    const updatedTasks = [...tasks];
    const updatedCompletedTasks = [...completedTasks];
    const index = updatedTasks.findIndex((t) => t._id === task._id);
    const completedIndex = updatedCompletedTasks.findIndex((t) => t._id === task._id);
  
    if (index !== -1) {
      updatedTasks.splice(index, 1);
      updatedCompletedTasks.push(task);
      // Update completion status in the backend
<<<<<<< HEAD
      await axios.put(ApiUpdateTaskCompletion, {
=======
      await router_auth.put(ApiUpdateTaskCompletion, {
>>>>>>> origin/master
        taskId: task._id,
        completion: true,
      });
    } else if (completedIndex !== -1) {
      updatedCompletedTasks.splice(completedIndex, 1);
      updatedTasks.push(task);
      // Update completion status in the backend
<<<<<<< HEAD
      await axios.put(ApiUpdateTaskCompletion, {
=======
      await router_auth.put(ApiUpdateTaskCompletion, {
>>>>>>> origin/master
        taskId: task._id,
        completion: false,
      });
    }
  
<<<<<<< HEAD
    const filteredUpdatedTasks = updatedTasks.filter(
      (task) => task.assigned_user === selectedUser || selectedUser === "off"
    );
    const filteredUpdatedCompletedTasks = updatedCompletedTasks.filter(
      (task) => task.assigned_user === selectedUser || selectedUser === "off"
    );
    setTasks(updatedTasks);
    setFilteredTasks(filteredUpdatedTasks);
    setCompletedTasks(updatedCompletedTasks);
    setFilteredCompletedTasks(filteredUpdatedCompletedTasks);
  };
  
  const handleDeleteTask = useCallback(async (taskId) => {
    try {
      await axios.request({
=======
    setTasks(updatedTasks);
    setCompletedTasks(updatedCompletedTasks);
  };  

  const handleDeleteTask = async (taskId) => {
    try {
      await router_auth.request({
>>>>>>> origin/master
        method: 'DELETE',
        url: ApiDeleteTask,
        headers: {
          'content-type': 'application/json',
        },
        data: {
          taskId: taskId,
        },
      });
<<<<<<< HEAD

      setFilteredTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      setFilteredCompletedTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId)
      );
    } catch (error) {
      console.error(error);
    }
  }, [tasks]);
=======
  
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      setCompletedTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error(error);
    }
  };
  
>>>>>>> origin/master

  const handleEditTask = (task) => {
    setEditTaskId(task._id);
    setEditTaskName(task.body);
<<<<<<< HEAD
    setEditAssignedUser(task.assigned_user);
    setOpenEditModal(true);
    setEditDateTime(task.start_date);
  };

  const handleSubmitEditTask = useCallback(async (event) => {
    event.preventDefault();

    try {
      await axios.request({
=======
    setOpenEditModal(true);
  };

  
  const handleSubmitEditTask = async () => {
    try {
      await router_auth.request({
>>>>>>> origin/master
        method: 'PUT',
        url: ApiEditTask,
        headers: {
          'content-type': 'application/json',
        },
        data: {
<<<<<<< HEAD
          assigned_user: editAssignedUser,
          start_date: editDateTime,
          end_date: 'String',
          complexity: 'String',
          repetition: 'String',
          body: editTaskName,
          notification_type: 'String',
          notification_time: 'String',
          admin_approval: 'String',
          spaceId: localStorage.getItem('spaceId'),
=======
          start_date: "String",
          end_date: "String",
          complexity: "String",
          repetition: "String",
          body: editTaskName,
          notification_type: "String",
          notification_time: "String",
          admin_approval: "String",
          spaceId: localStorage.getItem("spaceId"),
>>>>>>> origin/master
          taskId: editTaskId,
          completion: tasks.find((task) => task._id === editTaskId)?.completion || false,
        },
      });
<<<<<<< HEAD

      // Form submission is complete, close the modal
      setOpenEditModal(false);

      // Update the tasks state locally with the new task
      const updatedTask = {
        _id: editTaskId,
        assigned_user: editAssignedUser,
        start_date: editDateTime,
        end_date: 'String',
        complexity: 'String',
        repetition: 'String',
        body: editTaskName,
        notification_type: 'String',
        notification_time: 'String',
        admin_approval: 'String',
        completion: tasks.find((task) => task._id === editTaskId)?.completion || false,
      };

      const updatedTasks = tasks.map((task) =>
        task._id === editTaskId ? updatedTask : task
      );
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      setOpenEditModal(false);
    } catch (error) {
      console.error(error);
    }
  }, [editTaskId, editAssignedUser, editDateTime, editTaskName, tasks]);

  const handleShowTaskDetails = async (task) => {
    setSelectedTaskDetails(task);
    setOpenShowTaskDetailsModal(true);

    try {
      const response = await axios.request({
        method: 'POST',
        url: ApiFindUserById,
        headers: { 'content-type': 'application/json' },
        data: { userId: task.assigned_user },
      });

      const user = response.data;
      setAssignedUserName(user.userName);
=======
      // Form submission is complete, close the modal
      setOpenEditModal(false);
      
      const updatedTasks = await router_auth.request({
        method: 'POST',
        url: ApiFindTasksBySpaceAndUserId,
        headers: {'content-type': 'application/json'},
        data: {
          spaceId: localStorage.getItem("spaceId"),
        },
      });
      
      // Update the tasks state in AddTaskForm component with the new tasks
      setTasks(updatedTasks.data);
>>>>>>> origin/master
    } catch (error) {
      console.error(error);
    }
  };

<<<<<<< HEAD
  const handleChangeTaskFilter = (event) => {
    const selectedUserId = event.target.value;
    setSelectedUser(selectedUserId);
  
    if (selectedUserId === 'off') {
      setFilteredTasks(tasks); // Disable the filter, show all tasks
      setFilteredCompletedTasks(completedTasks);
    } else {
      const filteredIncompleteTasks = tasks.filter((task) => task.assigned_user === selectedUserId);
      const filteredCompleted = completedTasks.filter((task) => task.assigned_user === selectedUserId);
      setFilteredTasks(filteredIncompleteTasks);
      setFilteredCompletedTasks(filteredCompleted);
    }
  };
  

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);

    const options = {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    return dateTime.toLocaleString('en-GB', options);
  };

  const classes = useStylesAddTask();

  return (
    <div>
      <div className={classes.root}>
        <Button variant="contained" onClick={handleOpen}>
          Add Task
        </Button>
      </div>
      <TaskFilter selectedUser={selectedUser} onChange={handleChangeTaskFilter} />
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
                <TaskSelectUser setAssignedUser={setAssignedUser} />
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Date and Time
                <TaskDateTimePicker setDateTime={setDateTime} />
              </Typography>
              <div style={{ display: 'flex', gap: '175px', marginTop: '30px' }}>
                <Button type="submit">Add Task</Button>
                <Button onClick={handleClose}>Cancel</Button>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
      <div>
        <List
          sx={{
            position: 'absolute',
            top: '27%',
            left: '33%',
            width: '100%',
            maxWidth: 765,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="h6" component="h2" sx={{ pl: 1.5 }}>
            To-Do
          </Typography>
          {filteredTasks.map((value) => {
            const labelId = `checkbox-list-label-${value.body}`;

            return (
              <div key={value._id}>
                <ListItem disablePadding>
                  <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`${value.body}`} />
                  </ListItemButton>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <IconButton edge="end" aria-label="details" onClick={() => handleShowTaskDetails(value)}>
                      <InfoIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="comments" onClick={() => handleEditTask(value)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDeleteTask(value._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </ListItem>
              </div>
            );
          })}
        </List>
        <Modal
          open={openShowTaskDetailsModal}
          onClose={() => setOpenShowTaskDetailsModal(false)}
          aria-labelledby="task-details-modal-title"
          aria-describedby="task-details-modal-description"
        >
          <Box sx={style}>
            <Typography id="task-details-modal-title" variant="h6" component="h2">
              Task Details
            </Typography>
            {selectedTaskDetails && (
              <div>
                <Typography id="task-details-modal-description" sx={{ mt: 2 }}>
                  <div>
                    <p>Task Name: {selectedTaskDetails.body}</p>
                    <p>Assigned User: {assignedUserName}</p>
                    <p>Date and Time: {formatDateTime(selectedTaskDetails.start_date)}</p>
                  </div>
                </Typography>
              </div>
            )}
          </Box>
        </Modal>
=======
  return (
    <div>
      <List
        sx={{
          position: 'absolute',
          top: '27%',
          left: '40%',
          width: '100%',
          maxWidth: 550,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6" component="h2">
          To-Do
        </Typography>
        {tasks.map((value) => {
          const labelId = `checkbox-list-label-${value.body}`;

          return (
            <div key={value._id}>
              <ListItem disablePadding>
                <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={`${value.body}`} />
                </ListItemButton>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <IconButton edge="end" aria-label="comments" onClick={() => handleEditTask(value)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(value._id)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </ListItem>
            </div>
          );
        })}
>>>>>>> origin/master
        <Modal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Task Description
            </Typography>
            <form onSubmit={handleSubmitEditTask}>
              <div>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <div>
                    <p>Task Name</p>
                    <TextField
                      fullWidth
                      id="taskName"
                      value={editTaskName}
                      onChange={(event) => setEditTaskName(event.target.value)}
                    />
                  </div>
                </Typography>
<<<<<<< HEAD
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <div>
                    <p>Responsible User</p>
                    <TaskSelectUser setAssignedUser={setEditAssignedUser} />
                  </div>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Date and Time
                  <TaskDateTimePicker setDateTime={setEditDateTime} />
                </Typography>
                <div style={{ display: 'flex', gap: '175px', marginTop: '30px' }}>
                  <Button type="submit">Save Changes</Button>
=======
                <div style={{ display: 'flex', gap: '175px', marginTop: '30px' }}>
                  <Button type="submit" >Save Changes</Button>
>>>>>>> origin/master
                  <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
                </div>
              </div>
            </form>
<<<<<<< HEAD
          </Box>
        </Modal>
      </div>

      <List
        sx={{
          position: 'absolute',
          top: `calc(27% + ${filteredTasks.length * 50}px)`, // Updated top position
          left: '33%',
          width: '100%',
          maxWidth: 765,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6" component="h2" sx={{ pl: 1.5 }}>
          Completed
        </Typography>
        {filteredCompletedTasks.map((value) => {
=======
            
          </Box>
        </Modal>
      </List>
      <List
        sx={{
          position: 'absolute',
          top: '67%',
          left: '40%',
          width: '100%',
          maxWidth: 550,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6" component="h2">
          Completed
        </Typography>
        {completedTasks.map((value) => {
>>>>>>> origin/master
          const labelId = `checkbox-list-label-${value.body}`;

          return (
            <div key={value._id}>
              <ListItem disablePadding>
                <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={true} // Set the checkbox as checked for completed tasks
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={value.body}
                    sx={{ textDecoration: 'line-through' }} // Apply strikethrough style
                  />
                </ListItemButton>
                <div style={{ display: 'flex', gap: '8px' }}>
<<<<<<< HEAD
                    <IconButton edge="end" aria-label="details" onClick={() => handleShowTaskDetails(value)}>
                          <InfoIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="comments" onClick={() => handleEditTask(value)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton aria-label="delete" onClick={() => handleDeleteTask(value._id)}>
                          <DeleteIcon />
                    </IconButton>
                </div>
              </ListItem>
            </div>
          );
        })}
=======
                  <IconButton edge="end" aria-label="comments" onClick={() => handleEditTask(value)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(value._id)}>
                    <DeleteIcon />
                  </IconButton>
              </div>
            </ListItem>
          </div>
        );
        })}
        <Modal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Task Description
            </Typography>
            <form onSubmit={handleSubmitEditTask}>
              <div>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <div>
                    <p>Task Name</p>
                    <TextField
                      fullWidth
                      id="taskName"
                      value={editTaskName}
                      onChange={(event) => setEditTaskName(event.target.value)}
                    />
                  </div>
                </Typography>
                <div style={{ display: 'flex', gap: '175px', marginTop: '30px' }}>
                  <Button type="submit" >Save Changes</Button>
                  <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
                </div>
              </div>
            </form>
            
          </Box>
        </Modal>
>>>>>>> origin/master
      </List>
    </div>
  );
}
