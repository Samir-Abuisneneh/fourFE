// Importing necessary components and hooks
import { Button, TextField, Box, Typography, Avatar, Link, useMediaQuery } from "@mui/material";
import { styled } from '@mui/system';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormBox, FormPageContainer } from "./components";

const LoginButton = styled(Button)({
  textTransform: 'none'
})

const LoginScreen = () => {
  // State variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const response = await fetch('http://localhost:8080/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();

      localStorage.setItem('token', data.token);
      setErrorMessage('');

      navigate('/play');
    } else if (response.status === 403) {
      setErrorMessage('Incorrect username or password. Please try again.');
    } else {
      console.error(`Error: ${response.status}`);
    }
  };

  return (
    <FormPageContainer>
      <FormBox >
        <Avatar src="icon.png" alt="logo" sx={{ width: 100, height: 100 }} />
        <Box height={16} />
        <Typography variant="h5" gutterBottom>Log in</Typography>
        <form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Box height={16} />
          <LoginButton fullWidth variant="contained" type="submit">Log In</LoginButton>
          {errorMessage && (
            <Typography color="error" variant="body1" gutterBottom>
              {errorMessage}
            </Typography>
          )}
          <p>Don't have an account? {" "}
            <Link href="/register" underline="hover">
              Register
            </Link>
          </p>
        </form>
      </FormBox >
    </FormPageContainer>
  );
};

export default LoginScreen;
