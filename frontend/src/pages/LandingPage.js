import React from 'react';
import '../css/LandingPage.css'; 
import Profile from '../components/Profile';

export default function LandingPage({ isLoggedIn, USER_ID }) {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Bienvenido a Track-Up</h1>
        <p>Explora música nueva, crea tus listas de reproducción y conecta con artistas.</p>
        {/* Puedes añadir aquí una imagen de fondo o un carrusel de imágenes */}
      </div>

      {/* Featured Music Section */}
      <div className="featured-music">
        <h2>Música Destacada</h2>
        {/* Componente que muestra música destacada - ejemplo de implementación abajo */}
      </div>

      {/* Artist Spotlight Section */}
      <div className="artist-spotlight">
        <h2>En el Spotlight</h2>
        {/* Componente que destaca a los artistas - ejemplo de implementación abajo */}
      </div>

      {/* Si el usuario está logueado, muestra su perfil */}
      {isLoggedIn && <Profile USER_ID={USER_ID} />}
      
    </div>
  );
}


