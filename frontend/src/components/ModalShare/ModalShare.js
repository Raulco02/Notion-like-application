import React, { useState, useEffect } from 'react';
import './ModalShare.css';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ModalShare = ({ handleCloseModalShare, note }) => {

    const [friendsWithAccess, setFriendsWithAccess] = useState([]);
    const [friends, setFriends] = useState([]);
    const [hoveredFriendId, setHoveredFriendId] = useState(null); // Estado para almacenar el ID del amigo sobre el que está el ratón
    const [selectedValues, setSelectedValues] = useState({});


    useEffect(() => {

        getFriendsWithAccess();
        getFriends();

    }, []);

    const handleChange = (event, friendId) => {
        const value = event.target.value;
        setSelectedValues(prevState => ({
            ...prevState,
            [friendId]: value
        }));
        console.log("ID del amigo:", friendId);
        console.log("Valor seleccionado:", value);
    };

    const getFriendsWithAccess = () => {

        const friendsWithAccessJSON = {
            "friendsWA": [
                {
                    "_id": 1,
                    "email": "amigo1@example.com",
                    "userName": "Amigo 1",
                    "access": "read"
                }
            ]
        }

        setFriendsWithAccess(friendsWithAccessJSON.friendsWA);

    }

    const getFriends = () => {

        const friends = {
            "friends": [
                {
                    "_id": 1,
                    "email": "amigo1@example.com",
                    "userName": "Amigo 1",
                    "access": "read"
                },
                {
                    "_id": 2,
                    "email": "amigo2@example.com",
                    "userName": "Amigo 2",
                    "access": "read"
                },
                {
                    "_id": 3,
                    "email": "amigo3@example.com",
                    "userName": "Amigo 3",
                    "access": "write"
                }
            ]
        }

        setFriends(friends.friends);

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
            <span className="close" onClick={handleCloseModalShare}>&times;</span>
            <div className='modal-share-title'>
                Share note "{note.title}"
            </div>

            <div className='modal-share-title'>
                Share note with friends:
            </div>

            {friends !== undefined && friends
                .filter(friend => !friendsWithAccess.some(accessFriend => accessFriend._id === friend._id))
                .map((friend) => (
                    <div key={friend._id} className="friend-container" onMouseEnter={() => handleMouseEnter(friend._id)} onMouseLeave={handleMouseLeave} style={{ display: 'flex', margin: '1rem 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src="/whiteavatar.png" alt="Avatar" className="avatar" style={{ width: '50px', height: '50px' }} />
                        </div>
                        <div className="friend-info" style={{width:'220px'}}>
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
                                    onChange={(e) => handleChange(e, friend._id)}
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



            <div className='modal-share-title'>
                Friends with access:
            </div>

            {friendsWithAccess !== undefined && friendsWithAccess.map((friend) => (
                <div key={friend._id} className="friend-container" onMouseEnter={() => handleMouseEnter(friend._id)} onMouseLeave={handleMouseLeave} style={{ display: 'flex', margin: '1rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src="/whiteavatar.png" alt="Avatar" className="avatar" style={{ width: '50px', height: '50px' }} />
                    </div>
                    <div className="friend-info" style={{width:'220px'}}>
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
                                onChange={(e) => handleChange(e, friend._id)}
                            >
                                <MenuItem value="">
                                    <em>{friend.access}</em>
                                </MenuItem>
                                <MenuItem value={"Read"}>Read</MenuItem>
                                <MenuItem value={"Write"}>Write</MenuItem>
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