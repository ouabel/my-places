import React, { useState } from 'react';
import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';
import { Grid, Button, Paper, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import { Redirect } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';

const formFields = [
  {
    size: 12,
    field: (
      <TextField
        variant="filled"
        label="Name"
        name="name"
        margin="none"
        required={true}
      />
    ),
  },
  {
    size: 12,
    field: (
      <TextField
        variant="filled"
        label="Address"
        name="address"
        margin="none"
        required={true}
      />
    ),
  },
  {
    size: 12,
    field: (
      <TextField
        variant="filled"
        type="number"
        label="Latitude"
        name="latitude"
        margin="none"
        required={true}
      />
    ),
  },
  {
    size: 12,
    field: (
      <TextField
        variant="filled"
        type="number"
        label="Longitude"
        name="longitude"
        margin="none"
        required={true}
      />
    ),
  },
  {
    size: 12,
    field: (
      <TextField
        variant="filled"
        type="number"
        label="Postal code"
        name="postcode"
        margin="none"
        required={true}
      />
    ),
  },
];

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

function PlaceCreate() {
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const classes = useStyles();

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Field required';
    }
    if (!values.address) {
      errors.address = 'Field required';
    }
    if (!values.latitude) {
      errors.latitude = 'Field required';
    }
    if (!values.longitude) {
      errors.longitude = 'Field required';
    }
    if (!values.postcode) {
      errors.longitude = 'Field required';
    }
    return errors;
  };

  const handleSubmit = (values) => {
    const token = JSON.parse(localStorage.getItem('auth')).token;
    return axios.post(`/places`, values, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setRedirect(true);
    }).catch(err => {
      setError(err.response.data.detail || err.response.statusText || 'Something went wrong!');
    })
  };

  if (redirect) {
    return <Redirect to={{ pathname: "/places", }} />
  }

  return (
    <div className={classes.root}>
      <Typography variant="h5">New place</Typography>
      <Paper className={classes.paper}>
        <Form
          onSubmit={handleSubmit}
          validate={validate}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit} noValidate>
              <Grid container alignItems="flex-start" spacing={2}>
                {error &&
                <Grid item xs={12}><Alert severity="error" style={{ marginBottom: 16 }}>{error}</Alert></Grid>}
                {formFields.map((item, idx) => (
                  <Grid item xs={item.size} key={idx}>
                    {item.field}
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submitting}
                    fullWidth
                  >
                    Create
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        />
      </Paper>
    </div>
  );
}

export default PlaceCreate;
