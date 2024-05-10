import React from 'react';
import UserServiceInstance from '../services/UserService';
import { useNavigate } from 'react-router-dom';



const Prueba = () => {
    const navigate = useNavigate();

    const prueba = async () => {


            const response = await UserServiceInstance.checkSession();
            checkSession(response);

    };

    const checkSession = (response) => {
        if (response.status === 401) {
            navigate('/');
        }
    }

    return (
        <div>
            <button onClick={prueba}>Prueba</button>
        </div>
    );
};

export default Prueba;