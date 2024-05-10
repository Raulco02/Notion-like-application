import React, { useState, useEffect } from 'react';
import LeftMenuAdmin from './LeftMenuAdmin';
import UserServiceInstance from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import NoteManagemetAdmin from './NoteManagementAdmin';

const BackgroundComponent = ({ children }) => {
    const [reloadNotes, setReloadNotes] = useState(false);
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    
    const [allUserList, setAllUserList] = useState([]);
    const [actualUserNotes, setactualUserNotes] = useState([]);
    const [actualNote, setActualNote] = useState({});

    useEffect(() => {
        getAllUsers();
    }, []);

    const getAllUsers = async () => {
        try {
            const response = await UserServiceInstance.getUsers();
            setAllUserList(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    return (
        <div className='background'>

            <div className='left-menu'>
                <LeftMenuAdmin reloadNotes={reloadNotes} setReloadNotes={setReloadNotes} allUserList={allUserList} actualUserNotes={actualUserNotes} setactualUserNotes= {setactualUserNotes} setActualNote={setActualNote} />
            </div>

            <div className='content-background'>
                <NoteManagemetAdmin reloadNotes={reloadNotes} setReloadNotes={setReloadNotes} userName={userName} userId={userId} actualNote={actualNote} />
            </div>

        </div>
    );
};

export default BackgroundComponent;