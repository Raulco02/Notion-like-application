import React, { useState, useEffect } from 'react';
import FriendNotesLeftMenuComponent from './FriendNotesLeftMenuComponent';
import Navbar from '../Navbar/Navbar';
import UserServiceInstance from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const FriendNotesBackgroundComponent = ({ children }) => {
    const [reloadNotes, setReloadNotes] = useState(false);
    const navigate = useNavigate();
    const { friendName, friendId } = useParams();
    const [isAdmin, setIsAdmin] = useState(false);

    return (
        <div className='background'>
            <div className="navbar-menu">
                <Navbar isAdmin={isAdmin} />
            </div>

            <div className='left-menu'>
                <FriendNotesLeftMenuComponent friendId={friendId} friendName={friendName} reloadNotes={reloadNotes} setReloadNotes={setReloadNotes} />
            </div>

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

export default FriendNotesBackgroundComponent;