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

function PlaceShow({ match, coords }) {
  const [place, setPlace] = useState();
  const classes = useStyles();

  useEffect(() => {
    if (coords) {
      const token = JSON.parse(localStorage.getItem('auth')).token;
      axios.get(`/places/${match.params.id}/history`, {
        params: { latitude: coords.latitude, longitude: coords.longitude },
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setPlace(res.data);
      })
    }
  }, [coords]);

  return (
    <div className={classes.root}>
      <Typography variant="h5">Place details: {place && place.place.name}</Typography>
      <Paper className={classes.paper}>
        {coords ? '' : <Typography>Please enable location</Typography>}
        {place ? <Typography component="div">
          Name: {place.place.name}<br />
          Postal code: {place.place.postcode}
          <br /><br />
          Your Visits:
          <ul>
            {place.visits.map((v, i) => <li key={i}>{v}</li>)}
          </ul>
        </Typography> : <LinearProgress />}
      </Paper>
    </div>
  );
}

export default PlaceShow;
