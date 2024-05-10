import React, { useState, useEffect } from 'react';
import NoteServiceInstance from '../../services/NoteService';
import UserServiceInstance from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import { useTreeItem2Utils } from '@mui/x-tree-view/hooks/useTreeItem2Utils';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { set } from 'react-hook-form';

const LeftMenuAdmin = ({ reloadNotes, setReloadNotes, allUserList, actualUserNotes, setactualUserNotes, setActualNote }) => {
    const [userName, setUserName] = useState('');
    const [role, setRole] = useState('');
    const [selectedNoteId, setSelectedNoteId] = useState(null); // Estado para almacenar el ID de la nota seleccionada
    //const [reloadActualUserNotes, setreloadActualUserNotes] = useState(false);
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



    return (
        <div>
            <nav className='left-menu'>

                <ul className='top-menu' style={{ maxheight: '250px', overflowY: 'scroll' }}>
                    Users list by email
                    {allUserList.map(user => (
                        <li onClick={() => handleUserClick(user._id, user.userName)} style={{ margin: '1rem 0', marginLeft: '1rem' }} className='clickable' key={user._id}>{user.email}</li>
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
