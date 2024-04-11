import React, { useState, useEffect } from 'react';
import './Menu.css';
import Navbar from '../Navbar/Navbar';
import SignUpBox from '../Signup/SignupBox';
import UserServiceInstance from '../../services/UserService';
import { useNavigate } from 'react-router-dom';

const MenuComponent = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [inCollections, setInCollections] = useState(false);
    const [inUsersManagement, setInUsersManagement] = useState(false);
    const [collectionsList, setCollectionsList] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7']); // Lista de elementos para Collections
    const [usersList, setUsersList] = useState({}); // Lista de elementos para Users Management
    const [addingCollection, setAddingCollection] = useState(false);
    const [addingUser, setAddingUser] = useState(false);
    const [editingUser, setEditingUser] = useState(false);
    const [userSelected, setUserSelected] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const httpId = sessionStorage.getItem('httpId');
        if (!httpId) {
            navigate('/');
        }
        else {
            const getUser = async () => {
                try{
                    const user = await UserServiceInstance.getProfile();
                    if (user.data.role === 'a') {
                        setIsAdmin(true);
                    }
                } catch (error) {
                    console.error('Error al obtener el usuario:', error);
                }
            }
            getUser();
        }
    }, []);

    const handleCollections = () => {
        setInCollections(true);
        setInUsersManagement(false);
    };

    const handleUsers = async () => {
        setInCollections(false);
        setInUsersManagement(true);
        try {
            const response = await UserServiceInstance.getUsers(); //Hay que comprobar que se haga bien
            const usersDictionary = response.data.reduce((acc, user) => {
                acc[user._id] = user.userName;
                return acc;
            }, {});
            setUsersList(usersDictionary);
            setAddingUser(false);
        } catch (error) {
            console.error('Error al registrarse:', error);
        }
    };

    const addCollection = () => {
        setCollectionsList([...collectionsList, 'New Item']);
        setInCollections(false);
        setAddingCollection(true);
    };

    const addUser = () => {
        setInUsersManagement(false);
        setAddingUser(true);
    };
    
    const handleCreateUser = async(nombre, correo, pwd1, pwd2) => {
        try {
            await UserServiceInstance.register({ "userName": nombre, "email": correo, "pwd1": pwd1, "pwd2": pwd2 }); //Hay que comprobar que se haga bien
            setAddingUser(false);
        } catch (error) {
            console.error('Error al registrarse:', error);
          }
    }

    const handleEditUser = (id) => {
        setUserSelected(id);
        setInUsersManagement(false);
        setEditingUser(true);
        console.log(userSelected);
    };
    useEffect(() => {
        if (editingUser) {
            setUserSelected();
        }
    }, [editingUser]);

    const editUser = async(nombre, correo, pwd1, pwd2) => { //Hay que manejar que puede que haya algún campo que no se quiera editas
        try {
            await UserServiceInstance.updateUser(userSelected, { "userName": nombre, "email": correo, "pwd1": pwd1, "pwd2": pwd2 }); 
            setEditingUser(false);
            setUserSelected('');
        } catch (error) {
            console.error('Error al registrarse:', error);
          }
    }

    return (
        <div className='background-menu'>
            <div className='navbar-menu'>
                <Navbar isAdmin={isAdmin}/>
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
                        {Object.entries(usersList).map(([id, name]) => (
                            <button key={id} onClick={() => handleEditUser(id)} className='btn-menu'>{name}</button>
                        ))}
                        <button key='+ User' onClick={addUser} className='btn-menu'>+</button>
                    </div>
                )}

                {addingUser && (
                    <SignUpBox handleSignup={handleCreateUser}/>
                )}

                {editingUser && (
                    <SignUpBox handleSignup={editUser} userId={userSelected}/>
                )}

                {/* Botones de navegación */}
                {!inCollections && !inUsersManagement && !addingCollection && !addingUser && !editingUser && (
                    <React.Fragment>
                        <button className='btn-menu' onClick={handleCollections}>Collections</button>
                        {isAdmin && (
                            <button className='btn-menu' onClick={handleUsers}>Users Management</button>
                        )}
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default MenuComponent;