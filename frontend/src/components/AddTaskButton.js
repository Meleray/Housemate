import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '20%',
    right: '60%',
    textAlign: 'center',
  },
}));

export default function AddTaskButton() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Button variant="contained">Add Task</Button>
    </div>
  );
}
