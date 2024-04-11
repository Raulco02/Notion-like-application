import React, { useState, useEffect } from 'react';
import NoteServiceInstance from '../services/NoteService';
import UserServiceInstance from '../services/UserService';
import { useNavigate } from 'react-router-dom';

const LeftMenuComponent = ( { reloadNotes, setReloadNotes } ) => {
  const [notes, setNotes] = useState([]);
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  //const [reloadNotes, setReloadNotes] = useState(false); // Estado para recargar las notas
  const navigate = useNavigate();

  // Para listar las notas
  useEffect(() => {
    updateNotes();
  }, [reloadNotes]); // Agrega reloadNotes como una dependencia en useEffect

  useEffect(() => {
    async function obtenerPerfil() {
      try {
        const response = await UserServiceInstance.getProfile();
        if(response.data.error){
          navigate('/');
        }
        setUserName(response.data.userName);
        setRole(response.data.role);
        console.log(role)
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }
    obtenerPerfil();
  }, []);

  // Para mostrar nota cuando se hace clic
  const handleNoteClick = (noteId) => {
    navigate(`/note/${noteId}`);
  };

  const logoutClick = (noteId) => {
    sessionStorage.removeItem('httpId');
    async function logout() {
      try {
        const response = await UserServiceInstance.logout();
        console.log(response.data.message);
        navigate('/');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };
    logout();
  };

  const updateNotes = async () => {
    try {
      const response = await NoteServiceInstance.getUserNotes();
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
     
      navigate(`/note/${response.data.noteId}`);
      
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  return (
    <div>
      <nav className='left-menu'>
        <ul className='top-menu'>
          <li className='clickable'>
            <span onClick={logoutClick}>Logout</span>
          </li>
          <li>
            {userName && (<span><strong>{userName}'s notes</strong></span>)}
          </li>
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
        {(role==='a' && <ul className='top-menu'>
          <li className='clickable'>
            <span onClick={nuevaNotaClick}>Users management</span>
          </li>
        </ul>)}
      </nav>
    </div>
  );
};

export default LeftMenuComponent;
