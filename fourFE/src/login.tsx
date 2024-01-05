import { Button, TextField, Box, Container, Typography, Snackbar } from "@mui/material";
import styled from "@emotion/styled";
import React, { useState } from 'react';

const FuturisticButton = styled(Button)`
  background: linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%);
  border: 0;
  color: white;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 105, 135, 0.3);
`;

const Logo = styled("img")`
  width: 100px;
  height: 100px;
`;

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // TODO: Add validation for the inputs

    const response = await fetch('http://localhost:8080/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setOpenSuccessSnackbar(true); // Open success Snackbar on successful login
      localStorage.setItem('token', data.token);
    } else {
      setOpenErrorSnackbar(true); // Open error Snackbar on unsuccessful login
    }
  };

  const handleSuccessSnackbarClose = () => {
    setOpenSuccessSnackbar(false); // Close success Snackbar
  };

  const handleErrorSnackbarClose = () => {
    setOpenErrorSnackbar(false); // Close error Snackbar
  };

  return (
    <div>
      <Container
        xl={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#282c34",
        }}
      >
        <Logo src="logo.png" alt="logo" />
        <Typography variant="h4" component="h1" gutterBottom>
          Your Title
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField id="username" label="Username" variant="filled" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Box height={16} />
          <TextField id="password" label="Password" type="password" variant="filled" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Box height={16} />
          <FuturisticButton type="submit">Log In</FuturisticButton>
        </form>
        {/* Snackbar for successful login */}
        <Snackbar
          open={openSuccessSnackbar}
          autoHideDuration={6000} // Adjust as needed
          onClose={handleSuccessSnackbarClose}
          message="Login successful!"
        />
        {/* Snackbar for unsuccessful login */}
        <Snackbar
          open={openErrorSnackbar}
          autoHideDuration={6000} // Adjust as needed
          onClose={handleErrorSnackbarClose}
          message="Error in login!"
        />
      </Container>
    </div>
  );
};

export default LoginScreen;
