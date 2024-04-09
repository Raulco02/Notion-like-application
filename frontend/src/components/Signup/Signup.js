import React, { useState } from 'react';
import './Signup.css'; 
import UserServiceInstance from '../../services/UserService';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [pwd1, setPwd1] = useState('');
    const [pwd2, setPwd2] = useState('');
    const navigate = useNavigate();

    const handleSignup = async() => {
            try {
              await UserServiceInstance.register({ nombre, correo, pwd1, pwd2 }); //Hay que comprobar que se haga bien
              navigate('/login');
            } catch (error) {
              console.error('Error al registrarse:', error);
            }
      };

  return (
    <div className="signup-container">
      <div className="background-image"></div>
      <div className="signup-form">
        <div className="avatar-container">
          <img className="avatar" src="/logo.webp" alt="Avatar-Smart-Esi" />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
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
            value={pwd1}
            onChange={(e) => setPwd1(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={pwd2}
            onChange={(e) => setPwd2(e.target.value)}
          />
        </div>
        <button className="signup-button" onClick={handleSignup}>Sign up</button>
      </div>
    </div>
  );
};

export default Register;
