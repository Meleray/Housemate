import React, {useState, useEffect} from "react"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TaskList from './TaskList';
import axios from "axios";
import { ApiDeleteTask, ApiFindTasksBySpaceAndUserId } from "../../constants";

export default function TaskListContainer() {
  const [tasks, setTasks] = useState([]);
  const [taskSelectedIndex, setTaskSelectedIndex] = useState(-1);

  useEffect(() => {
      async function fetchData() {
          const response = await axios.request({
              method: 'POST',
              url: ApiFindTasksBySpaceAndUserId,
              headers: {'content-type': 'application/json',},
              data: {
                  spaceId: localStorage.getItem("spaceId")
              },
          });
          // if (isError(response)){
          //     return
          // }
          setTasks(response.data)                 // After one finds the data in the database this is the new value stored in the variable chats
      }

      fetchData();                // the fetch data is run
  }, []);

  const emptyMessage = (tasks.length === 0 && <h1>No tasks found</h1>)


  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

    // setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    const handleDeleteTask = async (taskId) => {   
      console.log(taskId)
      try {
        const response = await axios.request({
          method: 'DELETE',
          url: ApiDeleteTask,
          headers: {
            'content-type': 'application/json',
          },
          data: {
            taskId: taskId,
          },
        });
    
        // Form submission is complete, close the modal
      } catch (error) {
        // Handle error, if any
        console.error(error);
      }
    };
  

  return (
    <List
      sx={{
        position: 'absolute',
        top: '37%',
        left: '40%',
        width: '100%',
        maxWidth: 550,
        bgcolor: 'background.paper',
      }}
    >
      {tasks.map((value) => {
        const labelId = `checkbox-list-label-${value.body}`;

        return (
          <ListItem key={value} secondaryAction={
            <div style={{ display: 'flex', gap: '8px' }}>
              <IconButton edge="end" aria-label="comments">
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(value._id)}>
                <DeleteIcon />
              </IconButton>

            </div>
          } disablePadding>
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
          </ListItem>
        );
      })}
    </List>
  );
}
