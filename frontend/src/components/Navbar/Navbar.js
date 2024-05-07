import React, { useState, useEffect } from 'react';
import './Navbar.css'; // Importa el archivo CSS para aplicar estilos al navbar
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate para redirigir a otras páginas
import UserServiceInstance from '../../services/UserService'; // Importa el servicio UserService para hacer logout
import ModalFriendships from './ModalFiendships/ModalFriendships'; // Importa el componente ModalFriendships

function Navbar({ isAdmin }) {
  const navigate = useNavigate(); // Inicializa el hook useNavigate
  const [isModalFriendsOpen, setIsModalFriendsOpen] = useState(false); // Estado para controlar la apertura y cierre de la ventana modal
  const [isModalNotificationsOpen, setIsModalNotificationsOpen] = useState(false); // Estado para controlar la apertura y cierre de la ventana modal
  

  const handleClickUsers = () => {
    navigate('/usersManagement');
  }

  const handleClickLogout = () => {
    sessionStorage.removeItem('httpId'); //No parece que funcione, lo sigue mandando
    async function logout() {
      try {
        const response = await UserServiceInstance.logout();
        console.log(response.data.message);
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };
    logout();
    navigate('/');
  }

  const handleOpenModalFriends = () => {
    setIsModalNotificationsOpen(false);
    setIsModalFriendsOpen(true);

  }

  const handleCloseModalFriends = () => {
    setIsModalFriendsOpen(false);
  }

  const handleOpenModalNotifications = () => {
    setIsModalFriendsOpen(false);
    setIsModalNotificationsOpen(true);
  }

  const handleCloseModalNotifications = () => {
    setIsModalNotificationsOpen(false);
  }


  return (
    <div className="navbar">
      <div className="navbar-right">
        {/* Botones a la derecha */}
        {isAdmin && <button onClick={handleClickUsers} className="navbar-button">Users Management</button>}
        <button onClick={handleClickLogout} className="navbar-button">Logout</button>
        <div className="friends-container">
          <button onClick={handleOpenModalFriends} className="navbar-button friends">Friends</button>

          {/* modal amigos */}
          {isModalFriendsOpen && (
            <ModalFriendships
              handleCloseModalFriends={handleCloseModalFriends}
            />
          )}

        </div>

        <div className='notifications-container'>
          <button onClick={handleOpenModalNotifications} className="navbar-button">Notifications</button>

          {/* modal notificaciones */}
          {isModalNotificationsOpen && (
            <div className="modal-notifications">
              <span className="close" onClick={handleCloseModalNotifications}>&times;</span>
              <p>Contenido de la ventana modal notificaciones.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );


}

export default Navbar;