import React, { useState } from 'react';
import './Login.css'; 
import UserServiceInstance from '../../services/UserService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async() => {
            try {
              const id = await UserServiceInstance.login({ "email": correo, "password": password });
              console.log(id.data.httpId); 
              sessionStorage.setItem('httpId', id.data.httpId);
              navigate('/menu');
            } catch (error) {
              console.error('Error signing in:', error);
            }
      };

  return (
    <div className="login-container">
      <div className="background-image"></div>
      <div className="login-form">
        <div className="avatar-container">
          <img className="avatar" src="/logo.webp" alt="App-Avatar" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="login-button" onClick={handleLogin}>Sign in</button>
        <div className="form-links">
          <a href="/signup">¿You don´t have an acount? Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
