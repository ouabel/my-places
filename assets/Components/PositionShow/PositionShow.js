import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { LinearProgress, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    maxWidth: 360,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  paper: {
    width: '100%',
    padding: 16,
  },
});

function PlaceShow({ coords }) {
  const [position, setPosition] = useState();
  const classes = useStyles();

  useEffect(() => {
    if (coords) {
      const token = JSON.parse(localStorage.getItem('auth')).token;
      axios.get(`/position`, {
        params: { latitude: coords.latitude, longitude: coords.longitude },
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setPosition(res.data);
      })
    }
  }, [coords]);

  return (
    <div className={classes.root}>
      <Typography variant="h5">My position</Typography>
      <Paper className={classes.paper}>
        {coords ? '' : <Typography>Please enable location</Typography>}
        {position ? <Typography component="div">
          {position.address.label}
          <br />
          {position.place ? `Registered place: ${position.place.name} (${position.place.postcode})` : 'Your place is not registered'}
        </Typography> : <LinearProgress />}
      </Paper>
    </div>
  );
}

export default PlaceShow;
