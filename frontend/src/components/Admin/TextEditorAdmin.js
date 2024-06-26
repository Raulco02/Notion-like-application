import React, { useState, useEffect } from 'react';
import ReactQuill, { displayName } from 'react-quill';
// Quill
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import NoteServiceInstance from '../../services/NoteService';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const TextEditorAdmin = ({ noteSelected, setReloadNotes, reloadNotes, userName, userId }) => {

    const navigate = useNavigate();
    const [title, setTitle] = useState(noteSelected.title);
    const [content, setContent] = useState(noteSelected.content);
    const [editingTitle, setEditingTitle] = useState(false);
    const [isWRNO, setWRNO] = useState('');
    const [showRequestButton, setShowRequestButton] = useState(false);

    const [requestAccessModeType, setrequestAccessModeType] = useState('');

    const [showErrorSendingRequest, setshowErrorSendingRequest] = useState(''); //Podra ver '', 't' o 'f'

    const checkSession = (response) => {
        if (response.status === 401) {
            navigate('/');
        }
    }

    useEffect(() => {
        getAccessMode();
        setContent(noteSelected.content);
        setTitle(noteSelected.title);

    }, [noteSelected]);

    const getAccessMode = async () => {
        try {
            const response = await NoteServiceInstance.getAccessUser(noteSelected._id);
            console.log('El modo de acceso es:', response.data['access_mode:']);
            setWRNO(response.data['access_mode:']);
        } catch (error) {
            console.error('Error al obtener el modo de acceso:', error);
            checkSession(error.response);
        }
    };

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

            //actualizamos nota
            noteSelected.title = title;
            noteSelected.content = content;

        } catch (error) {
            console.error('Error al actualizar la nota:', error);
            checkSession(error.response);
        }
    };

    const deleteClick = async () => {
        try {
            const response = await NoteServiceInstance.deleteNoteById(noteSelected._id);
            console.log('La nota se eliminó correctamente:', response.data);
            setReloadNotes(!reloadNotes);
            
        } catch (error) {
            console.error('Error al actualizar la nota:', error);
            checkSession(error.response);
        }
    };

    const cancelClick = () => {
        setContent(noteSelected.content);
        setTitle(noteSelected.title);
    };

    const handleProcedureContentChange = (newContent) => {
        setContent(newContent);
    };

    const handleChangeAccessClick = async (event) => {

        switch (event.target.value) {
            case 'Read':
                setrequestAccessModeType('Read');
                setShowRequestButton(true);
                break;
            case 'Write':
                setrequestAccessModeType('Write');
                setShowRequestButton(true);
                break;
            case 'None':
                setrequestAccessModeType('');
                setShowRequestButton(false);
                break;
        }

    };

    const sendNoteRequest = async () => {
        try {
            let accessMode = '';
            switch (requestAccessModeType) {
                case 'Read':
                    accessMode = 'r';
                    break;
                case 'Write':
                    accessMode = 'w';
                    break;
            }

            const response = await NoteServiceInstance.requestSharing(noteSelected._id, accessMode);
            console.log('La solicitud de acceso se envió correctamente:', response.data);
            setshowErrorSendingRequest('t');

        } catch (error) {
            console.error('Error al enviar la solicitud de acceso:', error);
            checkSession(error.response);
            setshowErrorSendingRequest('f');
        }
    }

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

                </ul>


                <ul>
                    <li onClick={deleteClick}>
                        <img alt='Delete' src='/delete.png' height="25px"></img>
                    </li>
                </ul>



            </nav>

            <div>
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



        </div>
    );
};

export default TextEditorAdmin;
