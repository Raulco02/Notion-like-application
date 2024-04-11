import React, { useState, useEffect } from 'react';
import LeftMenuComponent from './LeftMenuComponent';
import Navbar from './Navbar/Navbar';
import UserServiceInstance from '../services/UserService';
import { useNavigate } from 'react-router-dom';

const BackgroundComponent = ({ children }) => {
    const [reloadNotes, setReloadNotes] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function obtenerPerfil() {
          try {
            const response = await UserServiceInstance.getProfile();
            if(response.data.error){
              navigate('/');
            }
            if (response.data.role === 'a') {
                setIsAdmin(true);
            }
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
        }
        obtenerPerfil();
      }, []);
    return (
        <div className='background'>
            <div className="navbar-menu">
                <Navbar isAdmin={isAdmin} />
            </div>

            <div className='left-menu'>
                <LeftMenuComponent reloadNotes={reloadNotes} setReloadNotes={setReloadNotes} />
            </div>

            {/* <div className='content-background'>
                { children }
            </div> */}

            <div className='content-background'>
                {/* Renderizar el componente children y pasarle los parámetros */}
                {React.Children.map(children, child => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, { reloadNotes, setReloadNotes });
                    }
                    return child;
                })}
            </div>

        </div>
    );
};

export default BackgroundComponent;