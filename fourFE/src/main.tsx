import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import LoginScreen from './login.tsx'; 
import RegScreen from './register.tsx';
import GamePage from './play.tsx';
import Leaderboard from './leaderboard.tsx';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegScreen />} />
      <Route path="/play" element={<GamePage />} />
      <Route path='/leaderboard' element={<Leaderboard/>} />
    </Routes>
  </BrowserRouter>
);
