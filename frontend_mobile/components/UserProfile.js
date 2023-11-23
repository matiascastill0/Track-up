import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { BACK_URL } from '../route';

const UserProfile = ({ userId, onLogout }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BACK_URL}/profile/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text>Email: {userData?.email}</Text>
      <Text>Songs: {userData?.songs.map(song => song.name).join(', ')}</Text>
      <Text>Playlists: {userData?.playlists.map(playlist => playlist.name).join(', ')}</Text>
      <Button title="Logout" onPress={onLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UserProfile;
