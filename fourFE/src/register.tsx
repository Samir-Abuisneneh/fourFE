import { Button, TextField, Box, Container, Typography, Snackbar } from "@mui/material";
import styled from "@emotion/styled";
import { useState } from "react";

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

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar

  const handleSubmit = async (event) => {
    event.preventDefault();

    // TODO: Add validation for the inputs

    const response = await fetch('http://localhost:8080/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setOpenSnackbar(true); // Open Snackbar on successful registration
      // Clear input fields after successful registration
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false); // Close Snackbar
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
          backgroundColor: "#ffffff",
        }}
      >
        <Logo src="logo.png" alt="logo" />
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField id="username" label="Username" variant="filled" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Box height={16} />
          <TextField id="email" label="Email" variant="filled" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Box height={16} />
          <TextField id="password" label="Password" type="password" variant="filled" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Box height={16} />
          <FuturisticButton type="submit">Register</FuturisticButton>
        </form>
        {/* Snackbar for successful registration */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000} // Adjust as needed
          onClose={handleSnackbarClose}
          message="Registration successful!"
        />
      </Container>
    </div>
  );
};

export default RegisterScreen;
