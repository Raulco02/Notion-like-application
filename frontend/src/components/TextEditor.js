import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
// Quill
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import NoteServiceInstance from '../services/NoteService';
import ModalShare from './ModalShare/ModalShare';

const TextEditor = ({ noteSelected, setReloadNotes, reloadNotes }) => {


  const navigate = useNavigate();
  const [title, setTitle] = useState(noteSelected.title);
  const [content, setContent] = useState(noteSelected.content);
  const [editingTitle, setEditingTitle] = useState(false);

  const [isModalShareOpen, setIsModalShareOpen] = useState(false); // Estado para controlar la apertura y cierre de la ventana modal


  useEffect(() => {
    setContent(noteSelected.content);
    setTitle(noteSelected.title);
  }, [noteSelected]);

  const handleTitleClick = () => {
    setEditingTitle(true);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleCloseModalShare = () => {
    setIsModalShareOpen(false);
  };

  const handleTitleBlur = () => {
    if (!title.trim()) {
      setTitle('Sin título');
    }
    setEditingTitle(false);
  };

  const modules = {
    toolbar: [
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video', 'audio'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }, { align: [] }],
      [{ 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466', 'custom-color'] }],
    ]
    // imageResize: {
    //   parchment: Quill.import('parchment'),
    //   modules: ['Resize', 'DisplaySize']
    // }
  };

  const formats = [
    'header', 'height', 'bold', 'italic',
    'underline', 'strike', 'blockquote',
    'list', 'color', 'bullet', 'indent',
    'link', 'image', 'video', 'align', 'size',
  ];

  const saveClick = async () => {
    console.log(content);

    const updatedNote = {
      title: title,
      content: content
    };

    try {
      const response = await NoteServiceInstance.updateNoteById(noteSelected._id, updatedNote);
      console.log('La nota se actualizó correctamente:', response.data);
      setReloadNotes(!reloadNotes);

      //actualizamos nota
      noteSelected.title = title;
      noteSelected.content = content;
      
    } catch (error) {
      console.error('Error al actualizar la nota:', error);
    }
  };

  const deleteClick = async () => {
    try {
      const response = await NoteServiceInstance.deleteNoteById(noteSelected._id);
      console.log('La nota se eliminó correctamente:', response.data);
      setReloadNotes(!reloadNotes);
      navigate('/noteMenu');
    } catch (error) {
      console.error('Error al actualizar la nota:', error);
    }
  };

  const cancelClick = () => {
    setContent(noteSelected.content);
    setTitle(noteSelected.title);
  };

  const handleProcedureContentChange = (newContent) => {
    setContent(newContent);
  };

  const shareClick = () => {
    setIsModalShareOpen(true);

    if (isModalShareOpen) {
      setIsModalShareOpen(false);
    }
  };

  return (
    <div className='text-editor'>
      <nav className='note-menu'>
        <ul>
          <li onClick={saveClick}>
            <img alt='Save' src='/floppy-disk.png' height="25px"></img>
          </li>
          <li onClick={cancelClick}>
            <img alt='Cancel' src='/cancel.png' height="25px"></img>
          </li>

          <div className='share-container'>
            <li onClick={shareClick}>
              <img alt='Share' src='/share.png' height="25px"></img>
            </li>

            {/* modal amigos */}
            {isModalShareOpen && (
              <ModalShare
                handleCloseModalShare={handleCloseModalShare}
                note={noteSelected}
              />
            )}
          </div>

        </ul>
        <ul>
          <li onClick={deleteClick}>
            <img alt='Delete' src='/delete.png' height="25px"></img>
          </li>
        </ul>
      </nav>

      {editingTitle ? (
        <input
          type="text"
          className="note-title-editable"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          autoFocus
        />
      ) : (
        <h1
          className="note-title"
          onClick={handleTitleClick}
        >
          {title}
        </h1>
      )}

      <ReactQuill
        value={content}
        theme="snow"
        modules={modules}
        formats={formats}
        placeholder="Write something..."
        onChange={handleProcedureContentChange}
      />
    </div>
  );
};

export default TextEditor;
