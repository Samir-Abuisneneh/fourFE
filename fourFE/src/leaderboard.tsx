// Leaderboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/play/leaderboards', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
          params: {
            page: 0,
            size: 10,
            sort: 'score',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.content);
          setLeaderboardData(data.content);
        } else {
          console.log('No data in response');
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);
  

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error fetching leaderboard: {error.message}</div>;
  }

  // Separate the data into easy and hard difficulty
  const easyDifficultyData = leaderboardData.filter(entry => entry.difficulty === 'EASY');
  const hardDifficultyData = leaderboardData.filter(entry => entry.difficulty === 'HARD');

  return (
    <div>
      <h2>Leaderboards</h2>

      <h3>Easy Difficulty</h3>
      {easyDifficultyData.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Questions Answered</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {easyDifficultyData.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{entry.user.username}</TableCell>
                  <TableCell>{entry.score}</TableCell>
                  <TableCell>{entry.questionsAnswered}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div>No easy difficulty data available</div>
      )}

      <h3>Hard Difficulty</h3>
      {hardDifficultyData.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Questions Answered</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hardDifficultyData.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{entry.user.username}</TableCell>
                  <TableCell>{entry.score}</TableCell>
                  <TableCell>{entry.questionsAnswered}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div>No hard difficulty data available</div>
      )}
    </div>
  );
};

export default Leaderboard;
