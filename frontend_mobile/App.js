import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginPage from './components/LoginPage';
import UserProfile from './components/UserProfile';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleLogin = (userId) => {
    setUserId(userId);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUserId(null);
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <UserProfile userId={userId} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
