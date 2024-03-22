import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import NoteServiceInstance from '../services/NoteService';

const TextEditor = ({ noteSelected }) => {
  const [title] = useState(noteSelected.title);
  const [content, setContent] = useState(noteSelected.content);

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
    // Acciones que deseas realizar cuando se hace clic en el elemento
    const updatedNote = {
      title: title,
      content: content
    }

    try {
      // Hacer la solicitud PUT al servidor para actualizar la nota
      const response = await NoteServiceInstance.updateNoteById(noteSelected._id, updatedNote);
      console.log('La nota se actualizó correctamente:', response.data);
    } catch (error) {
      console.error('Error al actualizar la nota:', error);
    }

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

          <li>
            Cancelar
          </li>

        </ul>

        <ul>
          <li>
            Eliminar
          </li>
        </ul>
      </nav>

      <h1 className='note-title'> {noteSelected.title} </h1>
      <ReactQuill
        value={noteSelected.content}
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
