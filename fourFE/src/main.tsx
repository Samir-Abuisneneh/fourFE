import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import LoginScreen from './login.tsx';
import RegScreen from './register.tsx';
import GamePage from './play.tsx';
import Leaderboard from './leaderboard.tsx';
import LoginScreen2 from './login2.tsx';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: "#e63447"
    }
  }
})
ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);
