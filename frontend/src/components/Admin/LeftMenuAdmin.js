import React, { useState, useEffect } from 'react';
import NoteServiceInstance from '../../services/NoteService';
import UserServiceInstance from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import { useTreeItem2Utils } from '@mui/x-tree-view/hooks/useTreeItem2Utils';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

const LeftMenuAdmin = ({ reloadNotes, setReloadNotes, allUserList, actualUserNotes, setactualUserNotes, setActualNote, setReloadUsers, reloadUsers, adminEmail }) => {
    const [userName, setUserName] = useState('');
    const [role, setRole] = useState('');
    const [selectedNoteId, setSelectedNoteId] = useState(null); // Estado para almacenar el ID de la nota seleccionada
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState(null);

    const navigate = useNavigate();

    const checkSession = (response) => {
        if (response.status === 401) {
            navigate('/');
        }
    }

    const CustomTreeItem = React.forwardRef(function MyTreeItem(props, ref) {
        const { interactions } = useTreeItem2Utils({
            itemId: props.itemId,
            children: props.children,
        });

        const handleContentClick = (event) => {
            event.defaultMuiPrevented = true;
            interactions.handleSelection(event);
        };

        const handleIconContainerClick = (event) => {
            interactions.handleExpansion(event);
        };

        return (
            <TreeItem2
                {...props}
                ref={ref}
                slotProps={{
                    content: { onClick: handleContentClick },
                    iconContainer: { onClick: handleIconContainerClick },
                }}

            />
        );
    });

    // Para listar las notas
    useEffect(() => {
        updateNotes();
    }, [reloadNotes]); // Agrega reloadNotes como una dependencia en useEffect

    useEffect(() => {
        async function obtenerPerfil() {
            try {
                const response = await UserServiceInstance.getProfile();
                if (response.data.error) {
                    navigate('/');
                }
                setUserName(response.data.userName);
                setRole(response.data.role);
                console.log(role)
            } catch (error) {
                console.error('Error fetching profile:', error);
                checkSession(error.response);
            }
        }
        obtenerPerfil();
    });

    // Para mostrar nota cuando se hace clic
    const handleUserClick = (userId, userName) => {
        setReloadNotes(!reloadNotes);
        //setSelectedNoteId(noteId);
        //navigate(`/note/${noteId}`);
        //setreloadActualUserNotes(!reloadActualUserNotes);
        setSelectedUserId(userId);
        setSelectedUserName(userName);

    };

    const updateNotes = async () => {
        try {
            const response = await NoteServiceInstance.getNotesUserAdmin(selectedUserId);
            setactualUserNotes(response.data);

            console.log('Notas:', response.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
            checkSession(error.response);
        }
    }

    const nuevaSubNotaClick = async (event) => {
        const newNote = {
            title: "Untitled",
            content: " ",
            referencedNoteId: selectedNoteId,
            user_id: selectedUserId
        }

        try {
            const response = await NoteServiceInstance.create_admin(newNote);
            console.log('Nueva nota añadida:', response.data);
            setReloadNotes(!reloadNotes); // Actualiza reloadNotes para recargar las notas

        } catch (error) {
            console.error('Error fetching notes:', error);
            checkSession(error.response);
        }
    }


    const nuevaNotaClick = async (event) => {
        event.preventDefault();

        const newNote = {
            title: "Untitled",
            content: " ",
            referencedNoteId: -1,
            user_id: selectedUserId
        }

        try {
            const response = await NoteServiceInstance.create_admin(newNote);
            console.log('Nueva nota añadida:', response.data);
            setReloadNotes(!reloadNotes); // Actualiza reloadNotes para recargar las notas

        } catch (error) {
            console.error('Error fetching notes:', error);
            checkSession(error.response);
        }
    };

    const renderSubNotes = (subNotes) => {
        if (!subNotes || subNotes.length === 0) return null;
        return subNotes.map(subNote => (
            <div key={subNote._id} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <CustomTreeItem
                    itemId={subNote._id}
                    nodeId={subNote._id}
                    label={subNote.title}
                    onClick={(event) => {
                        event.stopPropagation();
                        handleNoteClick(subNote._id);
                    }}
                    sx={{ marginLeft: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', width: '100%' }} // Aplica el estilo aquí
                >
                    {renderSubNotes(subNote.subNotes)}
                </CustomTreeItem>
            </div>
        ));
    };

    const handleNoteClick = (note, noteId) => {
        setSelectedNoteId(noteId);
        setActualNote(note);
    };

    const newUser = async () => {
        const name = prompt('Please enter the new user\'s name:');
        const email = prompt('Please enter the new user\'s email:');
        const password = prompt('Please enter the new user\'s password:');

        // Aquí puedes manejar los datos del nuevo usuario, como enviarlos al servidor
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Password:', password);

        if (name && email && password) {
            const newUser = {
                userName: name,
                email: email,
                password: password
            };

            try {
                const response = await UserServiceInstance.create(newUser);
                console.log('Nuevo usuario añadido:', response.data);
                setReloadUsers(!reloadUsers); // Actualiza reloadUsers para recargar los usuarios
            }
            catch (error) {
                console.error('Error fetching notes:', error);
                checkSession(error.response);
            }

        }
    };

    const deleteUser = async () => {
        const email = prompt('Please enter the email of the user you want to delete:');
        if (email && email !== adminEmail) {
            // Buscar el usuario con el correo electrónico proporcionado
            const userToDelete = allUserList.find(user => user.email === email);

            if (userToDelete) {
                const userIdToDelete = userToDelete._id;
                console.log(`User to delete found with ID: ${userIdToDelete}`);

                try {
                    const response = await UserServiceInstance.deleteUser(userIdToDelete);
                    console.log('Eliminado:', response.data);
                    setReloadUsers(!reloadUsers); // Actualiza reloadUsers para recargar los usuarios
                }
                catch (error) {
                    console.error('Error fetching notes:', error);
                    checkSession(error.response);
                }

            } else {
                console.log('User not found with the provided email.');
            }

        }
    };

    return (
        <div>
            <nav className='left-menu'>

                <div style={{ margin: '0 auto' }}>
                    <button onClick={newUser} className='aceptrejectbtn clickable' style={{ display: 'flex', alignItems: 'center', width: '200px', marginBottom: '0.5rem' }}>
                        <img src='/new.png' alt='+' height="40px" style={{ marginRight: '0.5rem' }} />
                        <div style={{ fontSize: '15px', color: 'white' }}>
                            New User
                        </div>
                    </button>
                </div>

                <div style={{ margin: '0 auto' }}>
                    <button onClick={deleteUser} className='aceptrejectbtn clickable' style={{ display: 'flex', alignItems: 'center', width: '200px' }}>
                        <img src='/trash.png' alt='-' height="40px" style={{ marginRight: '0.5rem' }} />
                        <div style={{ fontSize: '15px', color: 'white' }}>
                            Delete User
                        </div>
                    </button>
                </div>

                <ul className='top-menu' style={{ maxHeight: '250px', overflowY: 'scroll' }}>
                    Users list by email
                    {allUserList.map(user => (
                        // Se verifica si el email es diferente al email de administrador
                        user.email !== adminEmail && (
                            <li
                                onClick={() => handleUserClick(user._id, user.userName)}
                                style={{ margin: '1rem 0', marginLeft: '1rem' }}
                                className='clickable'
                                key={user._id}
                            >
                                {user.email}
                            </li>
                        )
                    ))}
                </ul>


                <ul className='top-menu'>

                    {selectedUserId && (
                        <li className='clickable'>
                            <span onClick={nuevaNotaClick} style={{ display: 'flex', flexDirection: 'row' }}>
                                <img alt='+' src='/sticky-note.png' height="30px" style={{ marginRight: '0.5rem' }} />
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    New note
                                </div>
                            </span>
                        </li>
                    )}

                    {selectedUserId && (
                        <li className='clickable'>
                            <span onClick={nuevaSubNotaClick} style={{ display: 'flex', flexDirection: 'row' }}>
                                <img alt='+' src='/notes.png' height="30px" style={{ marginRight: '0.5rem' }} />
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    New subnote
                                </div>
                            </span>
                        </li>
                    )}

                </ul>

                <ul className='top-menu' style={{ maxheight: '280px', overflowY: 'scroll' }}>
                    <li>
                        {selectedUserName && (<span ><strong>{selectedUserName}'s notes</strong></span>)}
                    </li>

                    <SimpleTreeView style={{ width: '100%', padding: '0' }}>
                        {actualUserNotes.map(note => (
                            <div key={note._id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <CustomTreeItem
                                    itemId={note._id}
                                    nodeId={note._id}
                                    label={note.title}
                                    onClick={() => handleNoteClick(note, note._id)}
                                    sx={{ marginLeft: 0 }}
                                    style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
                                >
                                    {renderSubNotes(note.subNotes)}
                                </CustomTreeItem>
                            </div>
                        ))}
                    </SimpleTreeView>

                </ul>

            </nav>
        </div>
    );
};

export default LeftMenuAdmin;
