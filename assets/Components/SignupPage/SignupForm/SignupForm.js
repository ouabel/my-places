import React, { useState } from 'react';
import { Form } from 'react-final-form';
import { TextField } from 'mui-rff';
import { Grid, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import { Redirect } from 'react-router';

const formFields = [
  {
    size: 12,
    field: (
      <TextField
        variant="filled"
        type="email"
        label="Email"
        name="email"
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
  {
    size: 12,
    field: (
      <TextField
        variant="filled"
        type="password"
        label="Poassword confirm"
        name="passwordConfirm"
        margin="none"
        required={true}
      />
    ),
  },
];

function SignupForm() {
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Email required';
    }
    if (!values.password) {
      errors.password = 'Password required';
    }
    if (values.password && !errors.password && values.passwordConfirm !== values.password) {
      errors.passwordConfirm = 'Passwords do not match';
    }
    return errors;
  };

  const handleSubmit = (values) => {
    return axios.post(`/register`, values)
      .then(res => {
        setRedirect(true);
      })
      .catch(err => {
        setError(err.response.data.detail || err.response.statusText || 'Something went wrong!');
      })
  };

  if (redirect) {
    return <Redirect to={{ pathname: "/login", }} />
  }

  return (
    <Form
      onSubmit={handleSubmit}
      validate={validate}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit} noValidate>
          <Grid container alignItems="flex-start" spacing={2}>
            {error && <Grid item xs={12}><Alert severity="error" style={{ marginBottom: 16 }}>{error}</Alert></Grid>}
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
                Signup
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    />
  );
}

export default SignupForm;
