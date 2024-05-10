import React from 'react';

const ModalNotifications = ({ handleCloseModalNotifications, friendRequests, FriendShipServiceInstance, reloadFriends, setReloadFriends, notifications, NotificationsServiceInstance }) => {

    const acceptFriendRequest = async (userId) => {

        console.log("El id es " + userId);

        try {
            await FriendShipServiceInstance.acceptFriendShipRequest(userId, "true");
            setReloadFriends(!reloadFriends);

        } catch (error) {
            console.error('Error refusing friend request:', error);

        }

    }

    const declineFriendRequest = async (userId) => {

        try {
            await FriendShipServiceInstance.acceptFriendShipRequest(userId, "false");
            setReloadFriends(!reloadFriends);
        } catch (error) {
            console.error('Error refusing friend request:', error);

        }

    }

    const deleteNotification = async (notificationId) => {

        try {
            await NotificationsServiceInstance.deleteNotification(notificationId);
            setReloadFriends(!reloadFriends);
        } catch (error) {
            console.error('Error refusing friend request:', error);

        }

    }

    return (
        <div className="modal-notifications">
            <span className="close" onClick={handleCloseModalNotifications}>&times;</span>

            {notifications.length === 0 && friendRequests.length === 0 && (
                <div style={{marginTop:'0.5rem', fontSize:'20px'}}>
                    <span>You are up to date!</span>
                </div>

            )}

            {friendRequests !== undefined && friendRequests.map((friendRequest) => (
                <div>

                    <div style={{ marginLeft: '0.2rem', marginTop: '0.8rem' }}>
                        {friendRequest.userName} wants to be your friend!
                    </div>

                    <div key={friendRequest._id} className="friend-container" style={{ display: 'flex', margin: '0 0 1rem 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src="/whiteavatar.png" alt="Avatar" className="avatar" style={{ width: '50px', height: '50px' }} />
                        </div>
                        <div className="friend-info">
                            <p style={{ margin: '0.5rem' }} className="name">{friendRequest.userName}</p>
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
                </div>
            ))}

            {notifications !== undefined && notifications.map((notification) => (
                <div key={notification._id}>

                    <div className="friend-container" style={{ display: 'flex', margin: '0 0 1rem 0', padding: '0.6rem' }}>
                        {notification.message}
                        <div className='aceptrejectbtn-container'>
                            {/* Rechazar solicitud de amistad */}
                            <button onClick={() => deleteNotification(notification._id)} className='aceptrejectbtn'>
                                <img src="/decline.png" alt="Reject" className="reject" style={{ width: '30px', height: '30px' }} />
                            </button>
                        </div>
                    </div>

                </div>
            ))}

        </div>
    );
};

export default ModalNotifications;