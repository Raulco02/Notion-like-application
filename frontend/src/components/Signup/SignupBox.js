import React, { useState, useEffect } from 'react';
import './Signup.css'; 
import UserServiceInstance from '../../services/UserService';

const SignUpBox = ({handleSignup, userId}) => {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [pwd1, setPwd1] = useState('');
    const [pwd2, setPwd2] = useState('');
    
    useEffect(() => {
      console.log('UserID en signup:', userId);
        if (userId) {
          // Si se proporciona un nombre de usuario, obtener los datos del usuario
          UserServiceInstance.getUserById(userId)
            .then(user => {
              setNombre(user.nombre);
              setCorreo(user.correo);
              // No establecer la contraseña para fines de seguridad
            })
            .catch(error => {
              console.error('Error al obtener los datos del usuario:', error);
            });
        } 
      }, [userId]);

  return (
    <div className="signup-container">
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
        {(!userId && <button className="signup-button" onClick={() => handleSignup(nombre, correo, pwd1, pwd2)}>Sign up</button>)}
        {(userId && <button className="signup-button" onClick={() => handleSignup(nombre, correo, pwd1, pwd2)}>Edit</button>)}
      </div>
    </div>
  );
};

export default SignUpBox;