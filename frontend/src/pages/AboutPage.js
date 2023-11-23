import React from 'react';
import '../css/AboutPage.css'; // Asumiendo que tienes un archivo CSS separado para estilos

const AboutPage = () => {
  return (
    <div className="about-container">
      <section className="hero-section">
        <h1>Welcome to Trackup</h1>
        <p>Discover music, create playlists, and connect with artists.</p>
      </section>
      
      <section className="mission-statement">
        <h2>Our Mission</h2>
        <p>En Trackup, nos esforzamos por conectar a los amantes de la música con las melodías que aman y los artistas que los crean.</p>
      </section>
      
      <section className="features-section">
        <h2>Features</h2>
        <ul>
          <li>Descubre nueva música con nuestras listas de reproducción curadas.</li>
          <li>Crea tus propias listas de reproducción con tus canciones favoritas.</li>
          <li>Conecta directamente con artistas y sigue sus perfiles.</li>
        </ul>
      </section>
      
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-members">
          {/* Repite este bloque para cada miembro del equipo */}
          <div className="team-member">
            <img src="/path-to-image.jpg" alt="Nombre Miembro" />
            <h3>Nombre Miembro</h3>
            <p>Posición</p>
            <p>Una breve descripción del miembro del equipo y su papel en la empresa.</p>
          </div>
          {/* ...otros miembros del equipo */}
        </div>
      </section>
      
      <section className="contact-section">
        <h2>Contact Us</h2>
        <p>¿Tienes preguntas? Estamos aquí para ayudar. Póngase en contacto con nosotros a través de email@example.com o síguenos en nuestras redes sociales.</p>
      </section>
      
      <footer className="about-footer">
        <p>Trackup © {new Date().getFullYear()}. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default AboutPage;
