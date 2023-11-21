import React, { } from 'react';
import './App.css';
  
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
  
import LandingPage from "./pages/LandingPage";
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AboutPage from './pages/AboutPage'
 
function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [USER_ID, setUserId] = React.useState('');

  return (
    <div className="vh-100 gradient-custom">
    <div className="container">

      <BrowserRouter>
        <Routes>
            <Route path="/" element={<LandingPage  isLoggedIn={isLoggedIn} USER_ID={USER_ID} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUserId={setUserId} />} />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </div>
    </div>
  );
}
   
export default App;