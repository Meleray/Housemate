import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(0),
  },
}));

export default function TaskDateTimePicker() {
  const classes = useStyles();
  const currentDate = new Date().toISOString().slice(0, 16); // Get the current date and time in the format "YYYY-MM-DDTHH:mm"

  return (
    <form className={classes.container} noValidate>
      <TextField
        id="datetime-local"
        type="datetime-local"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: currentDate, // Set the minimum allowed date to the current date and time
        }}
      />
    </form>
  );
}