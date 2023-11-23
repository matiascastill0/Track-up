import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import LandingPage from "./pages/LandingPage";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [USER_ID, setUserId] = useState('');

  return (
    <BrowserRouter>
      <div className="vh-100 gradient-custom">
        <Navbar /> {/* Navbar se incluye aquí */}
        <div className="container">
          <Routes>
            <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn} USER_ID={USER_ID} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
