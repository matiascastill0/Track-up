import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACK_URL } from '../route';

export default function Profile({ USER_ID }) {
  const [userData, setUserData] = useState(null);
  const [newSongName, setNewSongName] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BACK_URL}/profile/${USER_ID}`, { withCredentials: true });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [USER_ID]);

  const handleCreateSong = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newSongName);
      formData.append('user_id', USER_ID);
  
      // You can append other form data if needed
  
      const response = await axios.post(`${BACK_URL}/songs`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Update user data after creating the song
      setUserData((prevUserData) => ({
        ...prevUserData,
        songs: [...prevUserData.songs, { id: response.data, name: newSongName }],
      }));
  
      // Clear the input field
      setNewSongName('');
    } catch (error) {
      console.error('Error creating song:', error);
    }
  };
  
  const [editUserData, setEditUserData] = useState({
    firstName: '',
    lastName: '',
  });

  const handleEditUser = async () => {
    try {
      // Send a request to update the user with the edited data
      await axios.put(
        `${BACK_URL}/users/${USER_ID}`, // Adjust the endpoint accordingly
        {
          firstName: editUserData.firstName,
          lastName: editUserData.lastName,
        },
        { withCredentials: true }
      );
  
      // Update the user data after updating the user information
      setUserData((prevUserData) => ({
        ...prevUserData,
        firstName: editUserData.firstName,
        lastName: editUserData.lastName,
      }));
  
      // Clear the edit user data
      setEditUserData({
        firstName: '',
        lastName: '',
      });
    } catch (error) {
      console.error('Error updating user information:', error);
    }
  };
  

  const handlePlaySong = async (songId) => {
    try {
      const response = await axios.get(`${BACK_URL}/songs/${songId}`);
      const songData = response.data;

      // Set the selected song and its audio file for playback
      setSelectedSong(songData);
      setAudioFile(`/download/${songData.song_id}`);
    } catch (error) {
      console.error('Error fetching song data for playback:', error);
    }
  };

  const [editSongData, setEditSongData] = useState({
    id: '',
    name: '',
    about: '',
  });

  const handleEditSong = async (songId) => {
    try {
      // Fetch the song details by ID
      const response = await axios.get(`${BACK_URL}/songs/${songId}`);
      const songData = response.data;

      // Set the data for the song being edited
      setEditSongData({
        id: songData.song_id,
        name: songData.name,
        about: songData.about,
      });

      // You can now display your edit form or modal with the fetched song data
      // (You need to implement the edit form or modal component)
    } catch (error) {
      console.error('Error fetching song data for editing:', error);
    }
  };

  const handleUpdateSong = async () => {
    try {
      // Send a request to update the song with the edited data
      await axios.put(
        `${BACK_URL}/songs/${editSongData.id}`,
        {
          name: editSongData.name,
          about: editSongData.about,
        },
        { withCredentials: true }
      );

      // Update the user data after updating the song
      const updatedSongs = userData.songs.map((song) =>
        song.id === editSongData.id ? { ...song, name: editSongData.name, about: editSongData.about } : song
      );

      setUserData((prevUserData) => ({
        ...prevUserData,
        songs: updatedSongs,
      }));

      // Clear the edit song data and close the edit form or modal
      setEditSongData({
        id: '',
        name: '',
        about: '',
      });
      setSelectedSong(null);
      setAudioFile(null);
    } catch (error) {
      console.error('Error updating song:', error);
    }
  };

  const handleUpload = async () => {
    const file = document.getElementById('songFile').files[0];
    if (!file) {
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      await axios.post(`${BACK_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Handle successful upload
      console.log('Song uploaded successfully');
    } catch (error) {
      console.error('Error uploading song:', error);
    }
  };

    
  return (
    <div>
      <h2>User Profile</h2>
      {userData ? (
        <div>
          <p>Email: {userData.email}</p>
          <h3>Songs:</h3>
          <ul>
            {userData.songs.map((song) => (
              <li key={song.id}>
                {song.name}
                <button onClick={() => handlePlaySong(song.id)}>Play</button>
                <button onClick={() => handleEditSong(song.id)}>Edit</button>
              </li>
            ))}
          </ul>
          {selectedSong && (
            <div>
              <h3>Selected Song Details:</h3>
              <p>ID: {selectedSong.song_id}</p>
              <p>Name: {selectedSong.name}</p>
              <p>About: {selectedSong.about}</p>
              <audio controls src={audioFile} />
              <h3>Edit Song:</h3>
              <input
                type="text"
                placeholder="New Song Name"
                value={editSongData.name}
                onChange={(e) => setEditSongData({ ...editSongData, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="New Song About"
                value={editSongData.about}
                onChange={(e) => setEditSongData({ ...editSongData, about: e.target.value })}
              />
              <button onClick={handleUpdateSong}>Update Song</button>
            </div>
          )}
          <h3>Playlists:</h3>
          <ul>
            {userData.playlists.map((playlist) => (
              <li key={playlist.id}>{playlist.name}</li>
            ))}
          </ul>
          <div>
            <h3>Create a New Song:</h3>
            <input
              type="text"
              placeholder="Song name"
              value={newSongName}
              onChange={(e) => setNewSongName(e.target.value)}
            />
            <button onClick={handleCreateSong}>Create Song</button>
            <button onClick={handleUpload}>Upload Song</button>
          </div>
          // Inside your component's return statement
          <div>
             <h2>Edit User</h2>
             <input
               type="text"
               placeholder="First Name"
               value={editUserData.firstName}
               onChange={(e) => setEditUserData({ ...editUserData, firstName: e.target.value })}
             />
             <input
               type="text"
               placeholder="Last Name"
               value={editUserData.lastName}
               onChange={(e) => setEditUserData({ ...editUserData, lastName: e.target.value })}
             />
            <button onClick={handleEditUser}>Update User</button>
          </div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
