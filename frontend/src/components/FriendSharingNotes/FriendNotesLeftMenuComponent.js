import React, { useState, useEffect } from 'react';
import NoteServiceInstance from '../../services/NoteService';
import UserServiceInstance from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import { useTreeItem2Utils } from '@mui/x-tree-view/hooks/useTreeItem2Utils';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

const FriendNotesLeftMenuComponent = ({ reloadNotes, setReloadNotes, friendId, friendName }) => {
    const [notes, setNotes] = useState([]);
    const [userName, setUserName] = useState('');
    const [selectedNoteId, setSelectedNoteId] = useState(null); // Estado para almacenar el ID de la nota seleccionada

    const navigate = useNavigate();

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
    }, [friendId, reloadNotes]); // Agrega reloadNotes como una dependencia en useEffect

    useEffect(() => {
        async function obtenerPerfil() {
            try {
                const response = await UserServiceInstance.getProfile();
                if (response.data.error) {
                    navigate('/');
                }
                setUserName(response.data.userName);

            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        }
        obtenerPerfil();
    });

    // Para mostrar nota cuando se hace clic
    const handleNoteClick = (noteId) => {
        setSelectedNoteId(noteId);
        navigate(`/noteFriend/${friendName}/${friendId}/${noteId}`);
    };

    const updateNotes = async () => {
        try {
            const response = await NoteServiceInstance.getSharedNotes(friendId);
            setNotes(response.data);
            console.log('Notas del amigo:', response.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    }

    const returnMyNotes = () => {
        navigate('/noteMenu');

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



    return (
        <div>
            <nav className='left-menu'>

                <ul className='top-menu'>

                    <li className='clickable' style={{ marginBottom: '1.5rem' }}>
                        <span onClick={returnMyNotes} style={{ display: 'flex', flexDirection: 'row' }}>
                            <img alt='My notes' src='/home.png' height="40px" style={{ marginRight: '0.5rem' }} />
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                My notes
                            </div>
                        </span>
                    </li>

                    <li>
                        {friendName && (<span ><strong>{friendName}'s shared notes</strong></span>)}
                    </li>

                    {friendName && notes.length === 0 && (
                        <li>
                            <span>No shared notes</span>

                        </li>
                    )}

                    <SimpleTreeView style={{ width: '100%', padding: '0' }}>
                        {notes.map(note => (
                            <div key={note._id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <CustomTreeItem
                                    itemId={note._id}
                                    nodeId={note._id}
                                    label={note.title}
                                    onClick={() => handleNoteClick(note._id)}
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

export default FriendNotesLeftMenuComponent;
