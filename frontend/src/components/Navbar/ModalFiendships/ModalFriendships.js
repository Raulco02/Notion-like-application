import React, { useState, useEffect } from 'react';
import FriendShipServiceInstance from '../../../services/FriendShipService';
import { useNavigate } from 'react-router-dom';

import './ModalFriendships.css';

const ModalFriendships = ({ handleCloseModalFriends }) => {
    const [hoveredFriendId, setHoveredFriendId] = useState(null); // Estado para almacenar el ID del amigo sobre el que está el ratón
    const [searchFriendContent, setSearchFriendContent] = useState(''); // Estado para almacenar el contenido del input de búsqueda
    const [reloadFriends, setReloadFriends] = useState(false); // Estado para controlar la apertura y cierre de la ventana modal
    const [friends, setFriends] = useState([]); // Estado para almacenar la lista de amigos
    const [filteredFriends, setFilteredFriends] = useState([]); // Estado para almacenar la lista de amigos filtrada
    const [friendRequests, setFriendRequest] = useState([]); // Estado para almacenar la lista de solicitudes de amistad
    const [mensajeSolicitudAmistadEnviada, setMensajeSolicitudAmistadEnviada] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Código que se ejecutará al montar el componente o cuando alguna de las dependencias cambie
        getfriends();
        getfriendRequests();

    }, [reloadFriends]);


    const getfriends = async () => {

        const friends = await FriendShipServiceInstance.getUserFriends();
        console.log("Los amigos son ", friends.data.friends);
        setFriends(friends.data.friends);
        setFilteredFriends(friends.data.friends);

    }

    const getfriendRequests = async () => {

        const friendRequests = await FriendShipServiceInstance.getFriendShipRequests();
        console.log("Las solicitudes son ", friendRequests.data.requests);
        setFriendRequest(friendRequests.data.requests);

    }

    const handleChangesearchFriendContent = (e) => {
        const searchTerm = e.target.value;
        setSearchFriendContent(searchTerm);

        if (searchTerm.trim() === '') {
            // Si el input está vacío, mostrar todos los amigos sin filtrar
            setFilteredFriends(friends);

        } else {
            // Si hay un término de búsqueda, filtrar los amigos según el término
            const filteredFriends = friends.filter((friend) =>
                friend.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredFriends(filteredFriends);

        }
    };


    const handleClickRequestFriend = async (content) => {
        try {
            await FriendShipServiceInstance.sendFriendShipRequest(content);
            setMensajeSolicitudAmistadEnviada('s');
        } catch (error) {
            console.error('Error sending friend request:', error);
            setMensajeSolicitudAmistadEnviada('f');
        }
    };


    // Manejador de eventos para cuando el ratón entra al div de amigo
    const handleMouseEnter = (friendId) => {
        setHoveredFriendId(friendId);
    };

    // Manejador de eventos para cuando el ratón sale del div de amigo
    const handleMouseLeave = () => {
        setHoveredFriendId(null);
    };

    const declineFriendRequest = async (userId) => {

        try {
            await FriendShipServiceInstance.acceptFriendShipRequest(userId, "false");
            setReloadFriends(!reloadFriends);
        } catch (error) {
            console.error('Error refusing friend request:', error);

        }

    }

    const acceptFriendRequest = async (userId) => {

        console.log("El id es " + userId);

        try {
            await FriendShipServiceInstance.acceptFriendShipRequest(userId, "true");
            setReloadFriends(!reloadFriends);

        } catch (error) {
            console.error('Error refusing friend request:', error);

        }

    }

    const navigateFriendNotes = (friendName, friendId) => {
        navigate(`/friendNotes/${friendName}/${friendId}`);
    }

    const deleteFriend = async (userId) => {

        try {
            await FriendShipServiceInstance.deleteFriend(userId);
            setReloadFriends(!reloadFriends);

        } catch (error) {
            console.error('Error deleting friend:', error);

        }

    }

    return (
        <div className="modal-friends">
            <span className="close" onClick={handleCloseModalFriends}>&times;</span>
            {/* Buscador por correo electrónico */}
            <div style={{ display: 'flex' }}>
                <input
                    style={{ margin: '0.5rem 0 0 0' }}
                    type="text"
                    placeholder="Search friend by email..."
                    onChange={handleChangesearchFriendContent}
                />

                {((friends.length === 0 && filteredFriends.length === 0) ||
                    !(friends.length !== 0 && filteredFriends.length !== 0))
                    && (
                        <button onClick={() => handleClickRequestFriend(searchFriendContent)} className='aceptrejectbtn' style={{ display: 'flex', alignItems: 'center' }}>
                            <img src="/add-user.png" alt="Add user" className="search" style={{ width: '30px', height: '30px', margin: '0.5rem' }} />
                        </button>
                    )}

            </div>


            {mensajeSolicitudAmistadEnviada === 's' && (
                <div style={{ margin: '1rem 0', marginBottom: '2rem', backgroundColor: 'green', padding: '0.5rem', borderRadius: '5px' }}>
                    Request submitted successfully
                </div>
            )}

            {mensajeSolicitudAmistadEnviada === 'f' && (
                <div style={{ margin: '1rem 0', marginBottom: '2rem', backgroundColor: 'red', padding: '0.5rem', borderRadius: '5px' }}>
                    Fail sending request
                </div>
            )}


            {friendRequests.length > 0 && (
                <div style={{ margin: '1rem 0', fontSize: '20px' }}>
                    Friend requests:
                </div>
            )}
            {/* Lista de solicitudes de amistad */}
            {/* Iterar sobre el arreglo de solicitudes de amistad y generar un div por cada solicitud */}

            {friendRequests !== undefined && friendRequests.map((friendRequest) => (
                <div key={friendRequest._id} className="friend-container" style={{ display: 'flex', margin: '1rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/whiteavatar.png" alt="Avatar" className="avatar" style={{ width: '50px', height: '50px' }} />
                    </div>
                    <div className="friend-info">
                        <p style={{ margin: '0.5rem' }} className="name">{friendRequest.userNamename}</p>
                        <p style={{ margin: '0.5rem' }} className="email">{friendRequest.email}</p>
                    </div>

                    <div className='aceptrejectbtn-container'>
                        {/* Aceptar solicitud de amistad */}
                        <button onClick={() => acceptFriendRequest(friendRequest._id)} className='aceptrejectbtn'>
                            <img src="/accept.png" alt="Accept" className="accept" style={{ width: '30px', height: '30px' }} />
                        </button>
                        {/* Rechazar solicitud de amistad */}
                        <button onClick={() => declineFriendRequest(friendRequest._id)} className='aceptrejectbtn'>
                            <img src="/decline.png" alt="Reject" className="reject" style={{ width: '30px', height: '30px' }} />
                        </button>
                    </div>
                </div>
            ))}

            {friends.length > 0 ? (
                <div style={{ margin: '1rem 0', fontSize: '20px' }}>
                    Friends:
                </div>
            ) : (
                <div style={{ margin: '1rem 0', fontSize: '20px' }}>
                    You don't have friends yet. Look for some!
                </div>
            )}


            {/* Lista de amigos filtrada */}
            {/* Iterar sobre el arreglo de amigos filtrados y generar un div por cada amigo */}
            {filteredFriends !== undefined && filteredFriends.map((friend) => (
                <div key={friend._id} className="friend-container" onClick={() => navigateFriendNotes(friend.userName, friend._id)} onMouseEnter={() => handleMouseEnter(friend._id)} onMouseLeave={handleMouseLeave} style={{ display: 'flex', margin: '1rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '0.5rem' }}>
                        <img src="/whiteavatar.png" alt="Avatar" className="avatar" style={{ width: '50px', height: '50px' }} />
                    </div>
                    <div className="friend-info">
                        <div style={{ display: 'flex', flexDirection: 'row' }}>

                            {friend.sharing === true && (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img src="/sticky-note.png" alt="note" style={{ width: '20px', height: '20px' }} />
                                </div>
                            )}

                            <p style={{ margin: '0.5rem' }} className="name">{friend.userName}</p>
                        </div>
                        <p style={{ margin: '0.5rem' }} className="email">{friend.email}</p>
                    </div>

                    {hoveredFriendId === friend._id && (
                        <div className='delete-friend-container'>
                            <button onClick={() => deleteFriend(friend._id)} className='aceptrejectbtn'>
                                <img src="/bin.png" alt="Remove" className="delete-friend-image" style={{ width: '30px', height: '30px' }} />
                            </button>
                        </div>
                    )}

                </div>
            ))}
        </div>
    );
};

export default ModalFriendships;