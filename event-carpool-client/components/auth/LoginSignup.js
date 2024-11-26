// src/components/auth/LoginSignup.js
import '../../styles/home.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../../services/api';
import {jwtDecode} from 'jwt-decode'; 
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { LuLeafyGreen } from "react-icons/lu";
import { GiThreeFriends } from "react-icons/gi";
import { IoCarSportSharp } from "react-icons/io5";

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email: formData.email, password: formData.password });
      localStorage.setItem('token', response.data.token);
      const decoded = jwtDecode(response.data.token);
      localStorage.setItem('userId', decoded.id);
      navigate('/events');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await registerUser({ name: formData.name, email: formData.email, phone: formData.phone, password: formData.password });
      alert('Signup successful! Please login.');
      setIsLogin(true);
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup error');
    }
  };

  return (
    <div className="login-signup-container">
      {/* Left Section */}
      <div className="login-signup-left">
        <h1>Safar Sathi</h1>
        <p>Join the journey to connect and share,
            Your next event starts here!</p>

        {/* Feature Highlights */}
        <div className="features">
          <div className="feature-item">
          <RiMoneyRupeeCircleFill className="feature-icon"/>
            <p>Save Time and Money</p>
          </div>
          <div className="feature-item">
          <LuLeafyGreen className="feature-icon"/>
            <p>Eco-Friendly Travel</p>
          </div>
          <div className="feature-item">
          <GiThreeFriends className="feature-icon"/>
            <p>Connect with People</p>
          </div>
        </div>

        <br/>
        <IoCarSportSharp className="feature-icon"/>
        <p>Happy Carpooling</p> 
      </div>


      {/* Right Section */}
      <div className="login-signup-right">
        <div className="login-signup-form-container">
          {isLogin ? (
            <div id="login-form">
              <h2>Login</h2>
              <form className="login-signup-form" onSubmit={handleLogin}>
                <input
                  type="email"
                  name="email"
                  className="login-signup-input"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  className="login-signup-input"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button className="login-signup-button" type="submit">Login</button>
                <p>
                  Don't have an account?{' '}
                  <span onClick={() => setIsLogin(false)} className="login-signup-toggle-link">
                    Create a new account
                  </span>
                </p>
              </form>
            </div>
          ) : (
            <div id="signup-form">
              <h2>Sign Up</h2>
              <form className="login-signup-form" onSubmit={handleSignup}>
                <input
                  type="text"
                  name="name"
                  className="login-signup-input"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  className="login-signup-input"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="phone"
                  className="login-signup-input"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  className="login-signup-input"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  className="login-signup-input"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button className="login-signup-button" type="submit">Sign Up</button>
                <p>
                  Already have an account?{' '}
                  <span onClick={() => setIsLogin(true)} className="login-signup-toggle-link">
                    Login
                  </span>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;