import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
// Quill
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import NoteServiceInstance from '../services/NoteService';
// import ImageResize from 'quill-image-resize-module-react';

// window.Quill = Quill
// Quill.register('modules/imageResize', ImageResize);

const TextEditor = ({ noteSelected, setReloadNotes, reloadNotes }) => {


  const navigate = useNavigate();
  const [title, setTitle] = useState(noteSelected.title);
  const [content, setContent] = useState(noteSelected.content);
  const [editingTitle, setEditingTitle] = useState(false);

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

  const cancelClick = async () => {
    setContent(noteSelected.content);
    setTitle(noteSelected.title);
  };

  const handleProcedureContentChange = (newContent) => {
    setContent(newContent);
  };

  return (
    <div className='text-editor'>
      <nav className='note-menu'>
        <ul>
          <li onClick={saveClick}>
            Guardar
          </li>
          <li onClick={cancelClick}>
            Cancelar
          </li>
        </ul>
        <ul>
          <li onClick={deleteClick}>
            Eliminar
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
        placeholder="Escribe lo que quieras ...."
        onChange={handleProcedureContentChange}
      />
    </div>
  );
};

export default TextEditor;
