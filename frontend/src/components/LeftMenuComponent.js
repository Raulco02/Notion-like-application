import React, { useState, useEffect } from 'react';
import NoteServiceInstance from '../services/NoteService';
import { useNavigate } from 'react-router-dom';

const LeftMenuComponent = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  // Para listar las notas
  useEffect(() => {
    NoteServiceInstance.getNotes()
      .then(response => {
        setNotes(response.data);
      })
      .catch(error => {
        console.error('Error fetching notes:', error);
      });
  }, []);

  //para mostrar nota cuando se hace clic
  const handleNoteClick = (noteId) => {
    navigate(`/note/${noteId}`);
  };

  return (
    <div>
      <nav className='left-menu'>
        <ul className='top-menu'>
          <li className='clickable'>
            <span>Nueva nota +</span>
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
