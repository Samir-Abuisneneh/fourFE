// Importing necessary components and hooks
import { Button, TextField, Box, Container, Typography } from "@mui/material";
import { styled } from '@mui/system';
import { useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Styling the button using MUI's styled function
const FuturisticButton = styled(Button)`
  background: linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%);
  border: 0;
  color: white;
  height: 48px;
  padding: 0 30px;
  box-shadow: 0 3px 5px 2px rgba(255, 105, 135, 0.3);
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: scale(1.05);
  }
`;

// Styling the TextField to have a brighter background
const BrightTextField = styled(TextField)({
  '& .MuiFilledInput-root': {
    background: 'white',
    '&:hover': {
      backgroundColor: 'white',
    },
  },
});

// Styling the logo as an image
const Logo = styled("img")`
  width: 700px;
  height: 400px;
`;

// LoginScreen component
const LoginScreen = () => {
  // State variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Fetching data from the authentication API
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

    if (response.ok) {
      // Parsing the response data
      const data = await response.json();

      // If the request is successful, save the token
      localStorage.setItem('token', data.token);
      setErrorMessage(''); // Clear the error message

      // Navigate to the '/play' endpoint
      navigate('/play');
    } else if (response.status === 403 ) {
      // Set the error message for wrong credentials
      setErrorMessage('Incorrect username or password. Please try again.');
    } else {
      console.error(`Error: ${response.status}`);
    }
  };

  // JSX structure for the component
  return (
    <div>
      <Container
        xl={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: prefersDarkMode ? "#282c34" : "#fff",
        }}
      >
        <Logo src="logo.png" alt="logo" />
        <Typography variant="h4" component="h1" gutterBottom>
          Log in
        </Typography>
        {errorMessage && (  
          <Typography color="error" variant="body1" gutterBottom>
            {errorMessage}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <BrightTextField id="username" label="Username" variant="filled" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Box height={16} />
          <BrightTextField id="password" label="Password" type="password" variant="filled" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Box height={16} />
          <FuturisticButton type="submit">Log In</FuturisticButton>
        </form>
      </Container>
    </div>
  );
};

// Exporting the LoginScreen component
export default LoginScreen;
