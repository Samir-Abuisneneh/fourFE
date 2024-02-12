import LoginScreen from './login.tsx';
import RegScreen from './register.tsx';
import GamePage from './play.tsx';
import Leaderboard from './leaderboard.tsx';
import LoginScreen2 from './login2.tsx';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';



import Payment from './stripe/Payment.tsx'
import Completion from './stripe/Completion.tsx'

import {loadStripe} from '@stripe/stripe-js';
import {useEffect, useState} from 'react';
import Home from './home.tsx'
import './App.css'

const App = () => {

  const [ stripePromise, setStripePromise ] = useState(null);

  useEffect(() => {

    const storedToken = localStorage.getItem("token");

    fetch("http://localhost:8080/api/payment/config", {
      headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
      },
    }).then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);


  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/login2" element={<LoginScreen2 />} />
        <Route path="/register" element={<RegScreen />} />
        <Route path="/play" element={<GamePage />} />
        <Route path='/leaderboard' element={<Leaderboard />} />
        <Route path="/payment/pay" element={<Payment stripePromise={stripePromise} />} />
        <Route path="/payment/completion" element={<Completion stripePromise={stripePromise} />} />
      </Routes>
    </BrowserRouter>
    
  )
}

export default App;