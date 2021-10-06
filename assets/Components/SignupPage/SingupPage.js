import React from 'react';
import SignupForm from './SignupForm/SignupForm';
import { Link } from 'react-router-dom';
import { Button, Paper, Typography } from '@material-ui/core';

function SignupPage() {
  return (
    <div style={{
      maxWidth: '330px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    }}>
      <Paper style={{
        padding: '20px',
        marginTop: '30px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
        <SignupForm />
      </Paper>
      <Typography variant="body1" component="p" style={{ margin: '15px 0' }}>
        <span>Already have an account? </span>
        <Link to="/">
          <Button variant="text" color="primary">Login</Button>
        </Link>
      </Typography>
    </div>
  )
}

export default SignupPage;
