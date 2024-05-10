import React, { useState, useEffect } from 'react';
import TextEditorAdmin from './TextEditorAdmin';
import { useParams } from 'react-router-dom';
import NoteServiceInstance from '../../services/NoteService';
import { useNavigate } from 'react-router-dom';

const NoteManagemetAdmin = ({ reloadNotes, setReloadNotes, userName, userId, actualNote }) => {
    const { noteId } = useParams();
    const navigate = useNavigate();

    const checkSession = (response) => {
        if (response.status === 401) {
          navigate('/');
        }
      }

    return (
        <div>
            {actualNote && (
                <TextEditorAdmin userName={userName} userId={userId} reloadNotes={reloadNotes} setReloadNotes={setReloadNotes} noteSelected={actualNote} />
            )}
        </div>
    );
};

export default NoteManagemetAdmin;
