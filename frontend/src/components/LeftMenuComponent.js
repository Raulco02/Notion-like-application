import React, { useState, useEffect } from 'react';
import NoteServiceInstance from '../services/NoteService';
import { useNavigate } from 'react-router-dom';

const LeftMenuComponent = () => {
  const [notes, setNotes] = useState([]);
  const [reloadNotes, setReloadNotes] = useState(false); // Estado para recargar las notas
  const navigate = useNavigate();

  // Para listar las notas
  useEffect(() => {
    updateNotes();
  }, [reloadNotes]); // Agrega reloadNotes como una dependencia en useEffect

  // Para mostrar nota cuando se hace clic
  const handleNoteClick = (noteId) => {
    navigate(`/note/${noteId}`);
  };

  const updateNotes = async () => {
    try {
      const response = await NoteServiceInstance.getNotes();
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }

  const nuevaNotaClick = async (event) => {
    event.preventDefault();
    const newNote = {
      title: "Sin título",
      content: " "
    }
    
    try {
      const response = await NoteServiceInstance.createNote(newNote);
      console.log('Nueva nota añadida:', response.data);
      setReloadNotes(!reloadNotes); // Actualiza reloadNotes para recargar las notas
      
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  return (
    <div>
      <nav className='left-menu'>
        <ul className='top-menu'>
          <li className='clickable'>
            <span onClick={nuevaNotaClick}>Nueva nota +</span>
          </li>
        </ul>

        <ul className='top-menu'>
          <li>
            <span>Mis notas:</span>
          </li>

          {notes.map(note => (
            <li
              className="clickable"
              key={note._id}
              onClick={() => handleNoteClick(note._id)}
            >
              {note.title}
            </li>
          ))}

        </ul>
      </nav>
    </div>
  );
};

export default LeftMenuComponent;
