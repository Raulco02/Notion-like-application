import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import NoteServiceInstance from '../services/NoteService';

const TextEditor = ({ noteSelected }) => {
  const [title, setTitle] = useState(noteSelected.title);
  const [content, setContent] = useState(noteSelected.content);
  const [editingTitle, setEditingTitle] = useState(false); // Estado para controlar si se está editando el título o no

  // Esto se ejecuta al cargar el componente o cuando noteSelected cambia
  useEffect(() => {
    setContent(noteSelected.content);
    setTitle(noteSelected.title)
  }, [noteSelected]);

  const handleTitleClick = () => {
    setEditingTitle(true); // Al hacer clic en el título, cambiamos a modo de edición
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleTitleBlur = () => {
    if (!title.trim()) {
      setTitle('Sin título');
    } 

    setEditingTitle(false); // Cuando se sale del modo de edición, volvemos al modo de visualización
  };


  var modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
        { align: [] }
      ],
      [{ "color": ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color'] }],
    ]
  };

  var formats = [
    "header", "height", "bold", "italic",
    "underline", "strike", "blockquote",
    "list", "color", "bullet", "indent",
    "link", "image", "align", "size",
  ];

  const saveClick = async () => {
    const updatedNote = {
      title: title,
      content: content
    }

    console.log(updatedNote);
    try {

      const response = await NoteServiceInstance.updateNoteById(noteSelected._id, updatedNote);
      console.log('La nota se actualizó correctamente:', response.data);
    } catch (error) {
      console.error('Error al actualizar la nota:', error);
    }

  };

  const deleteClick = async () => {

    try {
      const response = await NoteServiceInstance.deleteNoteById(noteSelected._id);
      console.log('La nota se eliminó correctamente:', response.data);
    } catch (error) {
      console.error('Error al actualizar la nota:', error);
    }

  };

  const cancelClick  = async () => {
    setContent(noteSelected.content);
    setTitle(noteSelected.title);

  };

  const handleProcedureContentChange = (newcontent) => {
    setContent(newcontent);
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

      
      {editingTitle ? ( // Si estamos editando, mostramos un input para editar el título
        <input
          type="text"
          className="note-title-editable"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          autoFocus // Enfocar automáticamente el input cuando se cambia a modo de edición
        />
      ) : ( // Si no estamos editando, mostramos el título como un h1 que se puede hacer clic
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
      >
      </ReactQuill>
    </div>
  );
};

export default TextEditor;
