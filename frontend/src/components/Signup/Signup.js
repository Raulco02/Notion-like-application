import React, { useState } from 'react';
import './Signup.css';
import UserServiceInstance from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async (data) => {
    console.log(data);
    try {
      await UserServiceInstance.register(data); //Hay que comprobar que se haga bien
      navigate('/');
    } catch (error) {
      console.error('Error al registrarse:', error);
      setErrorMessage('Error signing up');

    }
  };

  return (
    <div className="signup-container">
      <div className="background-image"></div>
      <div className="signup-form">
        <div className="avatar-container">
          <img className="avatar" src="/logo.webp" alt="Avatar-Smart-Esi" />
        </div>

        <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit(handleSignup)}>

          <TextField label='Username' id="userName" {...register("userName", { required: true })} >
          </TextField>
          {errors.userName && <span style={{ color: 'red' }}>The input cannot be empty</span>}

          <TextField style={{ marginTop: '1rem' }} label='Email' id="email" {...register("email", { required: true })} >
          </TextField>
          {errors.email && <span style={{ color: 'red' }}>The input cannot be empty</span>}

          <TextField style={{ marginTop: '1rem' }} type='password' label='Password' id="pwd1" {...register("pwd1", { required: true })} >
          </TextField>
          {errors.pwd1 && <span style={{ color: 'red' }}>The input cannot be empty</span>}

          <TextField style={{ marginTop: '1rem' }} type='password' label='Repeat password' id="pwd2" {...register("pwd2", { required: true })} >
          </TextField>
          {errors.pwd2 && <span style={{ color: 'red' }}>The input cannot be empty</span>}

          {errorMessage && <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', borderRadius: '5px', marginTop: '2rem' }}>{errorMessage}</div>}

          <button style={{ marginTop: '1rem' }} type='submit' className="signup-button" >Sign up</button>

        </form>

        <div className="form-links">
          <p onClick={() => navigate('/')}>Are you already registered? Sign in</p>
        </div>

      </div>
    </div>
  );
};

export default Register;
