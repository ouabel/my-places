import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Button, Typography } from '@material-ui/core';
import LoginForm from './LoginForm/LoginForm';

function LoginPage({ setIsAuth }) {
  return (
    <div style={{
      maxWidth: '330px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    }}>
      <Typography variant="h5">Login</Typography>
      <Paper style={{
        padding: '20px',
        marginTop: '30px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
        <LoginForm setIsAuth={setIsAuth} />
      </Paper>
      <Typography variant="body1" component="p" style={{ margin: '15px 0' }}>
        <span>No account? </span>
        <Link to="/register">
          <Button variant="text" color="primary">Signup</Button>
        </Link>
      </Typography>
    </div>
  )
}

export default LoginPage;
