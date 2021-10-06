import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
  root: {
    maxWidth: 700,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  table: {
    minWidth: 650,
  },
});

function HistoryShow() {
  const [visits, setVisits] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('auth')).token;
    axios.get(`/history`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setVisits(res.data);
    })
  }, []);

  return (
    <div className={classes.root}>
      <Typography variant="h5">My History</Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Place</TableCell>
              <TableCell>Visits</TableCell>
              <TableCell>First visit</TableCell>
              <TableCell>Last Visit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visits.map((v, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  {v.city}
                </TableCell>
                <TableCell>
                  {v.count}
                </TableCell>
                <TableCell>
                  {v.visits[0] < v.visits[1] ? v.visits[0] : v.visits[1]}
                </TableCell>
                <TableCell>
                  {v.visits[0] > v.visits[1] ? v.visits[0] : v.visits[1]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default HistoryShow;
