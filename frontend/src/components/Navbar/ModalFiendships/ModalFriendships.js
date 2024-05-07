import React, { useState } from 'react';
import './ModalFriendships.css';

const ModalFriendships = ({ handleCloseModalFriends, friends, setFilteredFriends, filteredFriends, friendRequests, setFriendRequest }) => {
    const [hoveredFriendId, setHoveredFriendId] = useState(null); // Estado para almacenar el ID del amigo sobre el que está el ratón

    // Manejador de eventos para cuando el ratón entra al div de amigo
    const handleMouseEnter = (friendId) => {
        setHoveredFriendId(friendId);
    };

    // Manejador de eventos para cuando el ratón sale del div de amigo
    const handleMouseLeave = () => {
        setHoveredFriendId(null);
    };

    const declineFriendRequest = (userId) => {
        //Aquí se eliminaría la solicitud de amistad
        // Filtrar las solicitudes de amistad para eliminar la solicitud con el ID del usuario
        const updatedFriendRequests = friendRequests.filter((friendRequest) => friendRequest.id !== userId);
        // Actualizar el estado de las solicitudes de amistad
        setFriendRequest(updatedFriendRequests);
    }

    const acceptFriendRequest = (userId) => {
        //Aquí se aceptaría la solicitud de amistad
        // Filtrar las solicitudes de amistad para eliminar la solicitud con el ID del usuario
        const updatedFriendRequests = friendRequests.filter((friendRequest) => friendRequest.id !== userId);
        // Actualizar el estado de las solicitudes de amistad
        setFriendRequest(updatedFriendRequests);


    }

    return (
        <div className="modal-friends">
            <span className="close" onClick={handleCloseModalFriends}>&times;</span>
            {/* Buscador por correo electrónico */}
            <div style={{ display:'flex' }}>
                <input
                    style={{ margin: '0.5rem 0 0 0' }}
                    type="text"
                    placeholder="Search by email..."
                    onChange={(e) => {
                        const searchTerm = e.target.value;
                        // Filtrar la lista de amigos según el término de búsqueda
                        const filteredFriends = friends.filter((friend) =>
                            friend.email.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                        // Actualizar el estado de amigos filtrados
                        setFilteredFriends(filteredFriends);
                    }}
                />
            
            {filteredFriends.length === 0  && (
                <button className='aceptrejectbtn' style={{ display:'flex', alignItems:'center' }}>
                    <img src="/add-user.png" alt="Add user" className="search" style={{ width: '30px', height: '30px', margin:'0.5rem' }} />
                </button>
            )}
            </div>


            <div style={{ margin: '1rem 0', fontSize: '20px' }}>
                Friend requests:
            </div>
            {/* Lista de solicitudes de amistad */}
            {/* Iterar sobre el arreglo de solicitudes de amistad y generar un div por cada solicitud */}
            {friendRequests.map((friendRequest) => (
                <div key={friendRequest.id} className="friend-container" style={{ display: 'flex', margin: '1rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/whiteavatar.png" alt="Avatar" className="avatar" style={{ width: '50px', height: '50px' }} />
                    </div>
                    <div className="friend-info">
                        <p style={{ margin: '0.5rem' }} className="name">{friendRequest.name}</p>
                        <p style={{ margin: '0.5rem' }} className="email">{friendRequest.email}</p>
                    </div>

                    <div className='aceptrejectbtn-container'>
                        {/* Aceptar solicitud de amistad */}
                        <button onClick={() => acceptFriendRequest(friendRequest.id)} className='aceptrejectbtn'>
                            <img src="/accept.png" alt="Accept" className="accept" style={{ width: '30px', height: '30px' }} />
                        </button>
                        {/* Rechazar solicitud de amistad */}
                        <button onClick={() => declineFriendRequest(friendRequest.id)} className='aceptrejectbtn'>
                            <img src="/decline.png" alt="Reject" className="reject" style={{ width: '30px', height: '30px' }} />
                        </button>
                    </div>
                </div>
            ))}

            <div style={{ margin: '1rem 0', fontSize: '20px' }}>
                Friends:
            </div>
            {/* Lista de amigos filtrada */}
            {/* Iterar sobre el arreglo de amigos filtrados y generar un div por cada amigo */}
            {filteredFriends.map((friend) => (
                <div key={friend.id} className="friend-container" onMouseEnter={() => handleMouseEnter(friend.id)} onMouseLeave={handleMouseLeave} style={{ display: 'flex', margin: '1rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/whiteavatar.png" alt="Avatar" className="avatar" style={{ width: '50px', height: '50px' }} />
                    </div>
                    <div className="friend-info">
                        <p style={{ margin: '0.5rem' }} className="name">{friend.name}</p>
                        <p style={{ margin: '0.5rem' }} className="email">{friend.email}</p>
                    </div>

                    {hoveredFriendId === friend.id && (
                        <div className='delete-friend-container'>
                            <button className='aceptrejectbtn'>
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