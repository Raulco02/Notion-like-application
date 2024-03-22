import React, { useState, useEffect } from 'react';
import TextEditor from './TextEditor';
import { useParams } from 'react-router-dom';
import NoteServiceInstance from '../services/NoteService';

const NoteManagemetComponent = () => {
    const { noteId } = useParams();
    const [noteSelected, setNoteSelected] = useState(null);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await NoteServiceInstance.getNoteById(noteId);
                console.log(response.data.content)
                setNoteSelected(response.data);
            } catch (error) {
                console.error('Error fetching note by ID:', error);
            }
        };

        fetchNote();

    }, [noteId]); // Se ejecutará cada vez que noteId cambie o noteSelected.content cambie

    return (
        <div>
            {noteSelected && (
                <TextEditor noteSelected={noteSelected} />
            )}
        </div>
    );
};

export default NoteManagemetComponent;
