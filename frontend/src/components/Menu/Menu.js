import React, { useState } from 'react';
import './Menu.css';
import Navbar from '../Navbar/Navbar';

const MenuComponent = () => {
    const [inCollections, setInCollections] = useState(false);
    const [inUsersManagement, setInUsersManagement] = useState(false);
    const [collectionsList, setCollectionsList] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7']); // Lista de elementos para Collections
    const [usersList, setUsersList] = useState(['User 1', 'User 2', 'User 3', 'User 4', 'User 5', 'User 6', 'User 7']); // Lista de elementos para Users Management

    const handleCollections = () => {
        setInCollections(true);
        setInUsersManagement(false);
    };

    const handleUsers = () => {
        setInCollections(false);
        setInUsersManagement(true);
    };

    const addCollection = () => {
        setCollectionsList([...collectionsList, 'New Item']);
    };

    const addUser = () => {
        setUsersList([...usersList, 'New User']);
    };

    return (
        <div className='background-menu'>
            <div className='navbar-menu'>
                <Navbar />
            </div>
            <div className='content-background-menu'>
                {/* Renderizar botones según la lista activa */}
                {inCollections && (
                    <div>
                        {collectionsList.map((item, index) => (
                            <button key={index} className='btn-menu'>{item}</button>
                        ))}
                        <button key='+ Collection' onClick={addCollection} className='btn-menu'>+</button>
                    </div>
                )}
                {inUsersManagement && (
                    <div>
                        {usersList.map((item, index) => (
                            <button key={index} className='btn-menu'>{item}</button>
                        ))}
                        <button key='+ User' onClick={addUser} className='btn-menu'>+</button>
                    </div>
                )}
                {/* Botones de navegación */}
                {!inCollections && !inUsersManagement && (
                    <React.Fragment>
                        <button className='btn-menu' onClick={handleCollections}>Collections</button>
                        <button className='btn-menu' onClick={handleUsers}>Users Management</button>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default MenuComponent;