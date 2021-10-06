import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Paper, Typography } from '@material-ui/core';

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
  },
});

function PlaceList() {
  const [places, setPlaces] = useState([]);
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('auth')).token;
    axios.get('/places', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setPlaces(res.data);
    })
  }, []);

  return (
    <div className={classes.root}>
      <Typography variant="h5">Places list</Typography>
      <Paper className={classes.paper}>
        {places.length === 0 && <Typography>No places found</Typography>}
        <List component="nav" aria-label="secondary mailbox folders">
          {places.map(place => (
            <ListItem button key={place.id} onClick={() => history.push(`/places/${place.id}`)}>
              <ListItemText primary={`${place.name} (${place.postcode})`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
}

export default PlaceList;
