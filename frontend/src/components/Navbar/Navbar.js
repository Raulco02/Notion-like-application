import React, { useState, useEffect } from 'react';
import './Navbar.css'; // Importa el archivo CSS para aplicar estilos al navbar
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate para redirigir a otras páginas
import UserServiceInstance from '../../services/UserService'; // Importa el servicio UserService para hacer logout
import ModalFriendships from './ModalFiendships/ModalFriendships'; // Importa el componente ModalFriendships
import ModalNotifications from './ModalNotifications/ModalNotifications';
import NotificationsServiceInstance from '../../services/NotificationsService';
import FriendShipServiceInstance from '../../services/FriendShipService';

function Navbar({ isAdmin }) {
  const navigate = useNavigate(); // Inicializa el hook useNavigate
  const [isModalFriendsOpen, setIsModalFriendsOpen] = useState(false); // Estado para controlar la apertura y cierre de la ventana modal
  const [isModalNotificationsOpen, setIsModalNotificationsOpen] = useState(false); // Estado para controlar la apertura y cierre de la ventana modal
  const [isNotifications, setisNotifications] = useState(false); // Estado para controlar si hay notificaciones
  const [reloadNotifications, setReloadNotifications] = useState(false);
  const [friendRequests, setFriendRequest] = useState([]); // Estado para almacenar la lista de solicitudes de amistad
  const [notifications, setNotifications] = useState([]);

  const checkSession = (response) => {
    if (response.status === 401) {
      navigate('/');
    }
  }

  useEffect(() => {
    getNotifications();
    getfriendRequests();
  }, [reloadNotifications]);

  useEffect(() => {
    const interval = setInterval(() => {
      setReloadNotifications(prevState => !prevState);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getfriendRequests = async () => {

    try {
      const friendRequests = await FriendShipServiceInstance.getFriendShipRequests();
      console.log("Las solicitudes son ", friendRequests.data.requests);
      if (friendRequests.data.requests.length > 0) {
        setisNotifications(true);
      }
      setFriendRequest(friendRequests.data.requests);
    }
    catch (error) {
      checkSession(error.response);
    }



  }

  const getNotifications = async () => {
    try {
      const response = await NotificationsServiceInstance.getNotifications();

      console.log("Las notificaciones son ", response.data);
      setNotifications(response.data);

      if (response.data.length > 0) {
        setisNotifications(true);
      }
      else {
        setisNotifications(false);
      }
    }

    catch (error) {
      checkSession(error.response);
    }

  }

  const handleClickUsers = () => {
    navigate('/usersManagement');
  }

  const handleClickLogout = () => {
    sessionStorage.removeItem('httpId'); //No parece que funcione, lo sigue mandando
    // Eliminar la cookie "connect.sid"
    document.cookie = 'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    async function logout() {
      try {
        const response = await UserServiceInstance.logout();
        console.log(response.data.message);
      } catch (error) {
        console.error('Error logging out:', error);
        checkSession(error.response);
      }
    };
    logout();
    navigate('/');
  }

  const handleOpenModalFriends = () => {
    setIsModalNotificationsOpen(false);
    setIsModalFriendsOpen(true);

    if (isModalFriendsOpen) {
      setIsModalFriendsOpen(false);
    }

  }

  const handleCloseModalFriends = () => {
    setIsModalFriendsOpen(false);
  }

  const handleOpenModalNotifications = () => {
    setIsModalFriendsOpen(false);
    setIsModalNotificationsOpen(true);

    if (isModalNotificationsOpen) {
      setIsModalNotificationsOpen(false);
    }
  }

  const handleCloseModalNotifications = () => {
    setIsModalNotificationsOpen(false);
  }


  return (
    <div className="navbar">
      <div className="navbar-right">
        {/* Botones a la derecha */}
        {isAdmin &&
          <button onClick={handleClickUsers} className="navbar-button">
            <img src="/setting.png" alt="User management" height='30px' />
          </button>
        }

        <div className="friends-container">
          <button onClick={handleOpenModalFriends} className="navbar-button friends">
            <img src="/friends.png" alt="Friends" height='30px' />
          </button>

          {/* modal amigos */}
          {isModalFriendsOpen && (
            <ModalFriendships
              handleCloseModalFriends={handleCloseModalFriends}
            />
          )}

        </div>

        <div className='notifications-container'>
          <button onClick={handleOpenModalNotifications} className="navbar-button">
            <img src={isNotifications ? "/notification.png" : "/notification-disabled.png"} alt="Notifications" height='30px' />
          </button>

          {/* modal notificaciones */}
          {isModalNotificationsOpen && (
            <ModalNotifications
              handleCloseModalNotifications={handleCloseModalNotifications}
              friendRequests={friendRequests}
              FriendShipServiceInstance={FriendShipServiceInstance}
              reloadFriends={reloadNotifications}
              setReloadFriends={setReloadNotifications}
              notifications={notifications}
              NotificationsServiceInstance={NotificationsServiceInstance}
            />
          )}

        </div>

        <button onClick={handleClickLogout} className="navbar-button">
          <img src="/logout.png" alt="Logout" height='30px' />
        </button>

      </div>
    </div>
  );


}

export default Navbar;