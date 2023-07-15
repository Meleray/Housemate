import React, { useState, useEffect } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ApiDeleteTask, ApiFindTasksBySpaceAndUserId, ApiEditTask, ApiUpdateTaskCompletion, router_auth} from "../../constants";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@material-ui/core/Button';


export default function TaskListContainer() {
  const [tasks, setTasks] = useState([]);
  const [taskSelectedIndex, setTaskSelectedIndex] = useState(-1);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [checked, setChecked] = useState([]);
  const [editTaskId, setEditTaskId] = useState('');
  const [editTaskName, setEditTaskName] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);


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
      } catch (error) {
        console.error(error);
      }
    }
  
    fetchData();
  }, []);

  const handleToggle = (task) => async () => {
    const updatedTasks = [...tasks];
    const updatedCompletedTasks = [...completedTasks];
    const index = updatedTasks.findIndex((t) => t._id === task._id);
    const completedIndex = updatedCompletedTasks.findIndex((t) => t._id === task._id);
  
    if (index !== -1) {
      updatedTasks.splice(index, 1);
      updatedCompletedTasks.push(task);
      // Update completion status in the backend
      await router_auth.put(ApiUpdateTaskCompletion, {
        taskId: task._id,
        completion: true,
      });
    } else if (completedIndex !== -1) {
      updatedCompletedTasks.splice(completedIndex, 1);
      updatedTasks.push(task);
      // Update completion status in the backend
      await router_auth.put(ApiUpdateTaskCompletion, {
        taskId: task._id,
        completion: false,
      });
    }
  
    setTasks(updatedTasks);
    setCompletedTasks(updatedCompletedTasks);
  };  

  const handleDeleteTask = async (taskId) => {
    try {
      await router_auth.request({
        method: 'DELETE',
        url: ApiDeleteTask,
        headers: {
          'content-type': 'application/json',
        },
        data: {
          taskId: taskId,
        },
      });
  
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      setCompletedTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleEditTask = (task) => {
    setEditTaskId(task._id);
    setEditTaskName(task.body);
    setOpenEditModal(true);
  };

  
  const handleSubmitEditTask = async () => {
    try {
      await router_auth.request({
        method: 'PUT',
        url: ApiEditTask,
        headers: {
          'content-type': 'application/json',
        },
        data: {
          start_date: "String",
          end_date: "String",
          complexity: "String",
          repetition: "String",
          body: editTaskName,
          notification_type: "String",
          notification_time: "String",
          admin_approval: "String",
          spaceId: localStorage.getItem("spaceId"),
          taskId: editTaskId,
          completion: tasks.find((task) => task._id === editTaskId)?.completion || false,
        },
      });
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
    } catch (error) {
      console.error(error);
    }
  };

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
      </List>
    </div>
  );
}
