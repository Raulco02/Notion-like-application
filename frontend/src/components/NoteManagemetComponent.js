import React, { useState, useEffect } from 'react';
import TextEditor from './TextEditor';
import { useParams } from 'react-router-dom';
import NoteServiceInstance from '../services/NoteService';
import { useNavigate } from 'react-router-dom';

const NoteManagemetComponent = ({ reloadNotes, setReloadNotes, userName, userId }) => {
    const { noteId } = useParams();
    const [noteSelected, setNoteSelected] = useState(null);
    const navigate = useNavigate();

    const checkSession = (response) => {
        if (response.status === 401) {
          navigate('/');
        }
      }

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await NoteServiceInstance.getNoteById(noteId);
                console.log(response.data.content)
                setNoteSelected(response.data);
            } catch (error) {
                console.error('Error fetching note by ID:', error);
                checkSession(error.response);
            }
        };

        fetchNote();

    }, [noteId]); // Se ejecutará cada vez que noteId cambie o noteSelected.content cambie

    return (
        <div>
            {noteSelected && (
                <TextEditor userName={userName} userId={userId} reloadNotes={reloadNotes} setReloadNotes={setReloadNotes} noteSelected={noteSelected} />
            )}
        </div>
    );
};

export default NoteManagemetComponent;
