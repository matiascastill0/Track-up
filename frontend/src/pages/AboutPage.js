import React from 'react';
import myImage from './src/images/vynil.png'; 


const About = () => {
  return (
    <div>
      <h2>About Trackup</h2>
      <p>
        Trackup is a revolutionary platform for music enthusiasts. It allows users to discover new music, create playlists, and connect with artists.
      </p>
      <img src={myImage} alt="vynil" />
    </div>
  );
};

export default About;