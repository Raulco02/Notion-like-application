import React, { useState } from 'react';
import './Login.css';
import UserServiceInstance from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';


const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (data) => {
    console.log(data);
    try {
      const id = await UserServiceInstance.login(data);
      console.log(id.data.httpId);
      sessionStorage.setItem('httpId', id.data.httpId);
      navigate('/noteMenu');
    } catch (error) {
      console.error('Error signing in:', error);
      setErrorMessage('Error signing in');

    }
  };

  return (
    <div className="login-container">
      <div className="background-image"></div>
      <div className="login-form">
        <div className="avatar-container">
          <img className="avatar" src="/logo.webp" alt="App-Avatar" />
        </div>

        <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit(handleLogin)}>

          <TextField label='Email' id="email" {...register("email", { required: true })} >
          </TextField>
          {errors.email && <span style={{ color: 'red' }}>The input cannot be empty</span>}


          <TextField type='password' style={{ marginTop: '2rem' }} label='Password' id="password" {...register("password", { required: true })} >

          </TextField>
          {errors.password && <span style={{ color: 'red' }}>The input cannot be empty</span>}

          {errorMessage && <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', borderRadius: '5px', marginTop: '2rem' }}>{errorMessage}</div>}

          <button style={{ marginTop: '1rem' }} type='submit' className="login-button">Sign in</button>
        </form>

        <div className="form-links">
          <p onClick={() => navigate('/signup')}>You don't have an acount? Sign up</p>
        </div>

      </div>
    </div>
  );
};

export default Login;
