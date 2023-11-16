import React, { useState } from "react";
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import '../css/LoginPage.css';
import { BACK_URL } from "../route";
 
export default function LoginPage(){
 
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [successMessage,setSuccessMessage] = useState('');
   
    const navigate = useNavigate();
     
    const logInUser = () => {
        if(email.length === 0){
          alert("Email has left Blank!");
        }
        else if(password.length === 0){
          alert("password has left Blank!");
        }
        else{
          // link del backend en back_url
            axios.post(`${BACK_URL}/login`, {
                email: email,
                password: password
            })
            .then(function (response) {
                setSuccessMessage("User logged in successfully. Redirecting to home page..");
                setTimeout(() => {
                navigate("/");
                }, 2000);
            })
            .catch(function (error) {
                console.log(error, 'error');
                if (error.response.status === 401) {
                    alert("Invalid credentials");
                }
            });
        }
    }
 
    let imgs = [
      'https://as1.ftcdn.net/v2/jpg/03/39/70/90/1000_F_339709048_ZITR4wrVsOXCKdjHncdtabSNWpIhiaR7.jpg',
    ];
     
    return (
        <div className="login-page">
          <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="card login-card" style={{ minWidth: "400px" }}>
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Log Into Your Account</h2>
                <form>
                  {/* Email input */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter a valid email address"
                      required
                    />
                  </div>
                  {/* Password input */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                    />
                  </div>
                  {/* Remember me and Forgot password links */}
                  <div className="d-flex justify-content-between">
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" id="remember-me" />
                      <label className="form-check-label" htmlFor="remember-me">Remember me</label>
                    </div>
                    <a href="#!" className="forgot-password-link">Forgot password?</a>
                  </div>
                  {/* Success message */}
                  {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
                  {/* Login button */}
                  <button type="button" className="btn btn-primary w-100 mt-4" onClick={logInUser}>Login</button>
                  {/* Register link */}
                  <div className="text-center mt-3">
                    Don't have an account? <a href="/register" className="register-link">Register</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }