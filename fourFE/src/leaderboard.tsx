import React from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

const Leaderboard = () => {

    const data = [
        { username: 'User1', score: 100, difficulty: 'Easy' },
        { username: 'User2', score: 150, difficulty: 'Medium' },
        { username: 'User3', score: 200, difficulty: 'Hard' },
      ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Difficulty</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.username}</TableCell>
              <TableCell>{row.score}</TableCell>
              <TableCell>{row.difficulty}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Example usage
export default Leaderboard;