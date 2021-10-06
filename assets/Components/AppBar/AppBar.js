import React from 'react';
import { useHistory } from 'react-router-dom';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

function AppBar({ setIsAuth }) {
  const classes = useStyles();
  const history = useHistory()

  const handleLogout = () => {
    localStorage.clear();
    setIsAuth(false);
  }

  return (
    <div className={classes.root}>
      <MuiAppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            myPlaces
          </Typography>
          <Button color="inherit" onClick={() => history.push(`/position`)}>My Position</Button>
          <Button color="inherit" onClick={() => history.push(`/places`)}>Places List</Button>
          <Button color="inherit" onClick={() => history.push(`/places/create`)}>New pace</Button>
          <Button color="inherit" onClick={() => history.push(`/history`)}>My History</Button>
          <Button component="a" href="/api/doc">API doc</Button>
          <Button color="inherit" onClick={handleLogout} variant="outlined">Logout</Button>
        </Toolbar>
      </MuiAppBar>
    </div>
  );
}

export default AppBar;