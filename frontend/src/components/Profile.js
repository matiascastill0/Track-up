import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACK_URL } from '../route';
import '../css/Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Profile({ USER_ID }) {
  const [userData, setUserData] = useState(null);
  const [newSongName, setNewSongName] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [songToAdd, setSongToAdd] = useState('');

  // Nuevo estado para almacenar la URL del audio
  const [audioUrl, setAudioUrl] = useState(null);

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
      formData.append('file', audioFile);

      const response = await axios.post(`${BACK_URL}/songs`, formData, { withCredentials: true });
      setUserData((prevUserData) => ({
        ...prevUserData,
        songs: [...prevUserData.songs, { id: response.data, name: newSongName }],
      }));

      setNewSongName('');
      setAudioFile(null);
      setAudioUrl(null); // Limpiar URL del audio
    } catch (error) {
      console.error('Error creating song:', error);
    }
  };

  const handlePlaySong = async (songId) => {
    setSongToAdd(songId);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      const audioUrl = URL.createObjectURL(file);
      setAudioUrl(audioUrl); // Establecer la URL del archivo de audio
    }
  };

  const handleDeleteSong = async (songId) => {
    try {
      // Send a request to delete the song
      await axios.delete(`${BACK_URL}/songs/${songId}`, { withCredentials: true });
      // Update the user data after deleting the song
      const updatedSongs = userData.songs.filter((song) => song.id !== songId);
      setUserData((prevUserData) => ({
        ...prevUserData,
        songs: updatedSongs,
      }));
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      const response = await axios.post(
        `${BACK_URL}/playlists`,
        { name: newPlaylistName, user_id: USER_ID },
        { withCredentials: true }
      );

      // Update user data after creating the playlist
      setUserData((prevUserData) => ({
        ...prevUserData,
        playlists: [...prevUserData.playlists, { id: response.data, name: newPlaylistName }],
      }));

      // Clear the input field
      setNewPlaylistName('');
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const [editSongData, setEditSongData] = useState({
    id: '',
    name: '',
    about: '',
  });

  const handleUpdateSong = async (song_id) => {
    try {
      // Send a request to update the song with the edited data
      await axios.put(
        `${BACK_URL}/songs/${song_id}`,
        {
          name: editSongData.name,
          about: editSongData.about,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
  
      // Update the user data after updating the song
      const updatedSongs = userData.songs.map((song) =>
        song.id === song_id ? { ...song, name: editSongData.name, about: editSongData.about } : song
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

  const handleViewPlaylist = async (playlistId) => {
    try {
      const response = await axios.get(`${BACK_URL}/playlists/${playlistId}`);
      const playlistData = response.data;

      // Fetch complete song data for each song ID in the playlist
      const songsDataPromises = playlistData.songs.map(async (songId) => {
        const songResponse = await axios.get(`${BACK_URL}/songs/${songId}`);
        return songResponse.data;
      });

      // Wait for all promises to resolve
      const songsData = await Promise.all(songsDataPromises);

      // Set the selected playlist and its songs
      setSelectedPlaylist({
        id: playlistData.playlist_id,
        name: playlistData.name,
        songs: songsData,
      });
      console.log(songsData);
    } catch (error) {
      console.error('Error fetching playlist data:', error);
    }
  };

  const handleAddSongToPlaylist = async (playlistId) => {
    try {
      const songIdToAdd = songToAdd; // Use the selected song ID
      await axios.post(
        `${BACK_URL}/playlists/${playlistId}/songs/${songIdToAdd}`,
        null,
        { withCredentials: true }
      );

      // Refresh the playlist data
      handleViewPlaylist(playlistId);
    } catch (error) {
      console.error('Error adding song to playlist:', error);
    }
  };

  const handleRemoveSongFromPlaylist = async (playlistId, songId) => {
    try {
      // Send a request to remove the selected song from the playlist
      await axios.delete(
        `${BACK_URL}/playlists/${playlistId}/songs/${songId}`,
        { withCredentials: true }
      );
  
      // Refresh the playlist data
      handleViewPlaylist(playlistId);
    } catch (error) {
      console.error('Error removing song from playlist:', error);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      // Send a request to delete the playlist
      await axios.delete(`${BACK_URL}/playlists/${playlistId}`, { withCredentials: true });
  
      // Update the user data after deleting the playlist
      const updatedPlaylists = userData.playlists.filter((playlist) => playlist.id !== playlistId);
      setUserData((prevUserData) => ({
        ...prevUserData,
        playlists: updatedPlaylists,
      }));
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  }

  return (
    <div>
      <h2>User Profile</h2>
      {userData ? (
        <div>
          <p>Email: {userData.email}</p>
          <h3>Songs:</h3>
          <ul className="song-list">
            {userData.songs.map((song) => (
              <li key={song.id}>
                <span className="song-name">{song.name}</span>
                <button className="play-button" onClick={() => handlePlaySong(song.id)}>
                  <FontAwesomeIcon icon={faPlay} />
                </button>
                <button className="play-button" onClick={() => handleDeleteSong(song.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
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
              <button onClick={() => handleUpdateSong(selectedSong.song_id)}>Update Song</button>
            </div>
          )}
          <h3>Playlists:</h3>
          <ul>
          {userData.playlists.map((playlist) => (
              <li key={playlist.id}>
                <span>{playlist.name}</span>
                <button onClick={() => handleViewPlaylist(playlist.id)}>View Playlist</button>
                <button onClick={() => handleDeletePlaylist(playlist.id)}>Delete Playlist</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}

      {selectedPlaylist && (
        <div>
          <h3>Selected Playlist Details:</h3>
          <p>ID: {selectedPlaylist.id}</p>
          <p>Name: {selectedPlaylist.name}</p>
          <h3>Songs in Playlist:</h3>
          <ul>
            {selectedPlaylist.songs.map((song) => (
              <li key={song.song_id}>
                <span>{song.name}</span>
                <button onClick={() => handleRemoveSongFromPlaylist(selectedPlaylist.id, song.song_id)}>Remove Song</button>
              </li>
            ))}
          </ul>
          <h3>Add Song to Playlist:</h3>
          <select onChange={(e) => setSongToAdd(e.target.value)}>
            <option value="">Select a song</option>
            {userData.songs.map((song) => (
              <option key={song.id} value={song.id}>
                {song.name}
              </option>
            ))}
          </select>
          <button onClick={() => handleAddSongToPlaylist(selectedPlaylist.id)}>Add Song to Playlist</button>
        </div>
      )}

      <h3>Create New Song:</h3>
      <input
        type="text"
        placeholder="Song Name"
        value={newSongName}
        onChange={(e) => setNewSongName(e.target.value)}
      />
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      {audioUrl && <audio controls src={audioUrl} />}
      <button onClick={handleCreateSong}>Create Song</button>

      <h3>Create New Playlist:</h3>
      <input
        type="text"
        placeholder="Playlist Name"
        value={newPlaylistName}
        onChange={(e) => setNewPlaylistName(e.target.value)}
      />
      <button onClick={handleCreatePlaylist}>Create Playlist</button>
    </div>
  );
}



