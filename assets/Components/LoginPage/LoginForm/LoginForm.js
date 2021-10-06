import React, { useState } from 'react';
import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';
import { Grid, Button, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import axios from 'axios';

const formFields = [
  {
    size: 12,
    field: (
      <TextField
        variant="filled"
        type="text"
        label="Login"
        name="username"
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
        type="password"
        label="Password"
        name="password"
        margin="none"
        required={true}
      />
    ),
  },
];

const validate = (values) => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Required field';
  }
  if (!values.password) {
    errors.password = 'Required field';
  }
  return errors;
};

function LoginForm({ setIsAuth }) {
  const [error, setError] = useState(null);

  const handleSubmit = (values) => {
    return axios.post(`/login`, values)
      .then(res => {
        localStorage.setItem('auth', JSON.stringify(res.data));
        setIsAuth(true);
      })
      .catch(err => {
        setError(err.response.data.detail || err.response.statusText);
      })
  };

  return (
    <Form
      onSubmit={handleSubmit}
      validate={validate}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit} noValidate>
          <Grid container alignItems="flex-start" spacing={2}>
            {formFields.map((item, idx) => (
              <Grid item xs={item.size} key={idx}>
                {item.field}
              </Grid>
            ))}
            <Grid item xs={12}>
              {error && <Alert severity="error" style={{ marginBottom: 16 }}>Invalid credentials</Alert>}
              <Button
                disabled={submitting}
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                {submitting ? <CircularProgress size={24} /> : 'Login'}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    />
  );
}

export default LoginForm;
