import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { BACK_URL } from '../route';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const logInUser = () => {
    if (email.length === 0) {
      Alert.alert('Email is blank!');
    } else if (password.length === 0) {
      Alert.alert('Password is blank!');
    } else {
      axios
        .post(`${BACK_URL}/login`, {
          email: email,
          password: password,
        })
        .then(function (response) {
          setSuccessMessage('User logged in successfully. Redirecting to home page..');
          setTimeout(() => {
            onLogin(response.data.id);
            console.log(response.data.id);
            // Navigate to the home screen in your React Navigation stack
          }, 2000);
        })
        .catch(function (error) {
          console.log(error, 'error');
          if (error.response && error.response.status === 401) {
            Alert.alert('Invalid credentials');
          }
        });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://as1.ftcdn.net/v2/jpg/03/39/70/90/1000_F_339709048_ZITR4wrVsOXCKdjHncdtabSNWpIhiaR7.jpg' }} style={styles.image} />
      <View style={styles.card}>
        <Text style={styles.title}>Log Into Your Account</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter a valid email address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Text style={styles.forgotPassword}>Forgot password?</Text>
        {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
        <TouchableOpacity style={styles.loginButton} onPress={logInUser}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.registerLink}>Don't have an account? Register</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    minWidth: 400,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  forgotPassword: {
    textAlign: 'right',
    color: 'blue',
  },
  successMessage: {
    color: 'green',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
  },
  registerLink: {
    textAlign: 'center',
    marginTop: 10,
  },
});

export default LoginPage;
