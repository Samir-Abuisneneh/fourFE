import { Button, TextField, Box, Typography, Snackbar, Grid, Avatar, Link } from "@mui/material";
import { styled } from '@mui/system';
import { useState } from "react";
import { FormBox, FormPageContainer } from "./components";

const LoginButton = styled(Button)({
  textTransform: 'none'
})

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar

  const handleSubmit = async (event: any) => {
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
    <FormPageContainer>
      <FormBox >
        <Avatar src="icon.png" alt="logo" sx={{ width: 100, height: 100 }} />
        <Box height={16} />
        <Typography variant="h5" gutterBottom>Register</Typography>
        <form onSubmit={handleSubmit}>
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
            id="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <LoginButton fullWidth variant="contained" type="submit">Register</LoginButton>
          <p>Already have an account? {" "}
            <Link href="/login" underline="hover">
              Login
            </Link>
          </p>
        </form>
      </FormBox>
    </FormPageContainer>
  );
};

export default RegisterScreen;
