import React, { useState, useEffect } from 'react';
import './Navbar.css'; // Importa el archivo CSS para aplicar estilos al navbar
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate para redirigir a otras páginas
import UserServiceInstance from '../../services/UserService'; // Importa el servicio UserService para hacer logout
import ModalFriendships from './ModalFiendships/ModalFriendships'; // Importa el componente ModalFriendships
import FriendShipServiceInstance from '../../services/FriendShipService';

function Navbar({ isAdmin }) {
  const navigate = useNavigate(); // Inicializa el hook useNavigate
  const [isModalFriendsOpen, setIsModalFriendsOpen] = useState(false); // Estado para controlar la apertura y cierre de la ventana modal
  const [isModalNotificationsOpen, setIsModalNotificationsOpen] = useState(false); // Estado para controlar la apertura y cierre de la ventana modal

  //Lista completa de amigos
  const [friends, setFriends] = useState([]); // Estado para almacenar la lista de amigos

  //Lista de amigos filtrada (para la búsqueda)
  const [filteredFriends, setFilteredFriends] = useState([]);

  //Lista de solicitudes de amistad
  const [friendRequest, setFriendRequest] = useState([]); // Estado para almacenar la lista de amigos

  useEffect(() => {
    // Código que se ejecutará al montar el componente o cuando alguna de las dependencias cambie
    getfriends();
    getfriendRequests();
  }, []);


  const getfriends = async () => {

    const friends = {
      "friends": [
        {
          "id": 1,
          "name": "Juan",
          "email": "juan@example.com"
        },
        {
          "id": 2,
          "name": "Pedro",
          "email": "pedro@example.com"
        },
        {
          "id": 3,
          "name": "Laura",
          "email": "laura@example.com"
        },
        {
          "id": 4,
          "name": "Pilar",
          "email": "pilar@example.com"
        },
        {
          "id": 5,
          "name": "Alex",
          "email": "alex@example.com"
        },
        {
          "id": 6,
          "name": "Pepe",
          "email": "pepe@example.com"
        },
        {
          "id": 7,
          "name": "Luis",
          "email": "luis@example.com"
        },
        {
          "id": 8,
          "name": "Marcos",
          "email": "marcos@example.com"
        }
      ]
    };
    
    //const friends = await FriendShipServiceInstance.getUserFriends();

    setFriends(friends.friends);

  }

  const getfriendRequests = () => {
    const friendRequests = {
      "friendsRequests": [
        {
          "id": 10,
          "name": "Solicitud1",
          "email": "s1@example.com"
        },
        {
          "id": 11,
          "name": "Solicitud2",
          "email": "s2@example.com"
        }
      ]
    };

    setFriendRequest(friendRequests.friendsRequests);
  }

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

    // Al abrir la ventana modal, se muestra la lista completa de amigos
    setFilteredFriends(friends);
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
              friends={friends}
              setFriends={setFriends}
              setFilteredFriends={setFilteredFriends}
              filteredFriends={filteredFriends}
              friendRequests={friendRequest}
              setFriendRequest={setFriendRequest}

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