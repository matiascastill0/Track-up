import React from 'react';
import { Link } from 'react-router-dom';
import '../css/LandingPage.css'; // Asegúrate de que la ruta sea correcta

export default function LandingPage() {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">MyApp</Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-toggle="collapse" 
            data-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto"> {/* ml-auto will align the nav items to the right */}
              <li className="nav-item active">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
              {/* Puedes agregar más elementos <li> para otros enlaces según sea necesario */}
            </ul>
          </div>
        </div>
      </nav>
      
      {/* Contenido principal de la Landing Page */}
      <div className="main-content">
        {/* Aquí puedes agregar contenido a tu landing page, como un título, imágenes o un llamado a la acción. */}
      </div>
    </div>
  );
}
