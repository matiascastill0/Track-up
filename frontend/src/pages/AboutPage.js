import React from 'react';
import myImage from './images/vynil.png';

const About = () => {
  // Define inline styles for the image
  const imageStyle = {
    width: '200px', // Adjust width as needed
    height: '200px', // Adjust height as needed
    borderRadius: '50%', // Makes the image a circle if it's square
    objectFit: 'cover', // Ensures the image covers the entire space
  };

  return (
    <div>
      <h2>About Trackup</h2>
      <p>
        Trackup is a revolutionary platform for music enthusiasts. It allows users to discover new music, create playlists, and connect with artists.
      </p>
      <img src={myImage} alt="My Image" style={imageStyle} />
    </div>
  );
};

export default About;
