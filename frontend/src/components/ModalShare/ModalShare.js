import React, { useState, useEffect } from 'react';
import './ModalShare.css';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FriendShipServiceInstance from '../../services/FriendShipService';
import NoteServiceInstance from '../../services/NoteService';
import { useNavigate } from 'react-router-dom';

const ModalShare = ({ handleCloseModalShare, note, userName, userId, reloadNotes, setReloadNotes }) => {

    const [friendsWithAccess, setFriendsWithAccess] = useState([]);
    const [friends, setFriends] = useState([]);
    const [hoveredFriendId, setHoveredFriendId] = useState(null); // Estado para almacenar el ID del amigo sobre el que está el ratón
    const [selectedValues, setSelectedValues] = useState({});
    const [reloadFriends, setReloadFriends] = useState(false); // Estado para controlar la apertura y cierre de la ventana modal
    const navigate = useNavigate();

    const checkSession = (response) => {
        if (response.status === 401) {
            navigate('/');
        }
    }

    useEffect(() => {
        getFriendsWithAccess();
        getFriends();
    }, [note, reloadNotes]);


    const handleChangeAccessClick = async (event, friendId) => {

        var accessMode = '';
        switch (event.target.value) {
            case 'Read':
                accessMode = 'r';
                break;
            case 'Write':
                accessMode = 'w';
                break;
            case 'None':
                accessMode = 'n';
                break;
            case 'Delete':
                accessMode = 'n';
                break;
        }
        try {
            const response = await NoteServiceInstance.setSharing(friendId, note._id, accessMode, "false");
            setReloadNotes(!reloadNotes);
        }
        catch (error) {
            checkSession(error.response);
        }

    };

    const getFriendsWithAccess = async () => {

        try {
            const friendsWithAccessJSON = await NoteServiceInstance.getAccessUsers(note._id);
            console.log("Los amigos con permiso son ", friendsWithAccessJSON.data);
            setFriendsWithAccess(friendsWithAccessJSON.data);
        }
        catch (error) {
            checkSession(error.response);

        }


    }

    const copyLinkClipboard = () => {
        const link = "http://localhost:3002/noteFriend/" + userName + '/' + userId + '/' + note._id;
        console.log(link);

        const el = document.createElement('textarea');
        el.value = link;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        alert("Link copied to clipboard");

    }

    const getFriends = async () => {

        // const friends = {
        //     "friends": [
        //         {
        //             "_id": 1,
        //             "email": "amigo1@example.com",
        //             "userName": "Amigo 1",
        //             "access": "read"
        //         },
        //         {
        //             "_id": 2,
        //             "email": "amigo2@example.com",
        //             "userName": "Amigo 2",
        //             "access": "read"
        //         },
        //         {
        //             "_id": 3,
        //             "email": "amigo3@example.com",
        //             "userName": "Amigo 3",
        //             "access": "write"
        //         }
        //     ]
        // }

        try {
            const friends = await FriendShipServiceInstance.getUserFriends();
            console.log("Los amigos son ", friends.data.friends);
            setFriends(friends.data.friends);
        }
        catch (error) {
            checkSession(error.response);

        } 

    }

    // Manejador de eventos para cuando el ratón entra al div de amigo
    const handleMouseEnter = (friendId) => {
        setHoveredFriendId(friendId);
    };

    // Manejador de eventos para cuando el ratón sale del div de amigo
    const handleMouseLeave = () => {
        setHoveredFriendId(null);
    };

    return (
        <div className='modal-share'>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="close" onClick={handleCloseModalShare}>&times;</span>
                <button onClick={copyLinkClipboard} className='aceptrejectbtn'>
                    <img src="/copy.png" alt="Copy" style={{ width: '30px' }} />
                </button>
            </div>


            <div className='modal-share-title'>
                Share note "{note.title}"
            </div>

            {friends !== undefined && friends
                .filter(friend => !friendsWithAccess.some(accessFriend => accessFriend._id === friend._id))
                .map((friend) => (
                    <div key={friend._id} className="friend-container" onMouseEnter={() => handleMouseEnter(friend._id)} onMouseLeave={handleMouseLeave} style={{ display: 'flex', margin: '1rem 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src="/whiteavatar.png" alt="Avatar" className="avatar" style={{ width: '50px', height: '50px' }} />
                        </div>
                        <div className="friend-info" style={{ width: '220px' }}>
                            <p style={{ margin: '0.5rem' }} className="name">{friend.userName}</p>
                            <p style={{ margin: '0.5rem' }} className="email">{friend.email}</p>
                        </div>

                        <div>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <Select
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    style={{ backgroundColor: 'white' }}
                                    value={selectedValues[friend._id] || ''}
                                    onChange={(e) => handleChangeAccessClick(e, friend._id)}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={"Read"}>Read</MenuItem>
                                    <MenuItem value={"Write"}>Write</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                    </div>
                ))}


            {friendsWithAccess.length > 1 ? (
                <div style={{ margin: '1rem 0', fontSize: '20px' }}>
                    Friends with access:
                </div>
            ) : (
                <div style={{ margin: '1rem 0', fontSize: '20px' }}>
                    You haven't shared this note with anyone yet!
                </div>
            )}


            {friendsWithAccess !== undefined && friendsWithAccess
                .filter(friend => friend.accessMode !== "o") // Filtrar amigos cuyo accessMode no sea "o"
                .map((friend) => (
                    <div key={friend._id} className="friend-container" onMouseEnter={() => handleMouseEnter(friend._id)} onMouseLeave={handleMouseLeave} style={{ display: 'flex', margin: '1rem 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src="/whiteavatar.png" alt="Avatar" className="avatar" style={{ width: '50px', height: '50px' }} />
                        </div>
                        <div className="friend-info" style={{ width: '220px' }}>
                            <p style={{ margin: '0.5rem' }} className="name">{friend.userName}</p>
                            <p style={{ margin: '0.5rem' }} className="email">{friend.email}</p>
                        </div>

                        <div>
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <Select
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    style={{ backgroundColor: 'white' }}
                                    value={selectedValues[friend._id] || ''}
                                    onChange={(e) => handleChangeAccessClick(e, friend._id)}
                                >
                                    <MenuItem value="">
                                        {friend.accessMode === "w" && ( // Añade MenuItem extra si accessMode es "r"
                                            <em>Write</em>
                                        )}
                                        {friend.accessMode === "r" && ( // Añade MenuItem extra si accessMode es "r"
                                            <em>Read</em>
                                        )}
                                    </MenuItem>

                                    {friend.accessMode === "r" && ( // Añade MenuItem extra si accessMode es "r"
                                        <MenuItem value="Write">Write</MenuItem>
                                    )}

                                    {friend.accessMode === "w" && ( // Añade MenuItem extra si accessMode es "r"
                                        <MenuItem value="Read">Read</MenuItem>
                                    )}

                                    <MenuItem value={"Delete"}>Delete</MenuItem>

                                </Select>
                            </FormControl>
                        </div>

                    </div>
                ))}


        </div>
    );
};

export default ModalShare;