import React from 'react';
import '../css/LandingPage.css'; // Asegúrate de que la ruta sea correcta
import Profile from '../components/Profile';
import Navbar from '../components/Navbar';

export default function LandingPage({isLoggedIn, USER_ID}) {
  

  return (
    <div>
      
      <Navbar  />
      
      {/* Contenido principal de la Landing Page */}
      <div className="main-content">
      {isLoggedIn ? (
        <>
          <Profile USER_ID={USER_ID}/>
          </>
        ) : ( <></> )}
      </div>
    </div>
  );
}
