import React, { useState, useEffect } from 'react';
import TransferList from './TransferList';
import NoteServiceInstance from '../services/NoteService';
import collectionServiceInstance from '../services/CollectionService';
import UserServiceInstance from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const CollectionComponent = () => {
    const { collectionId } = useParams();
    const [userNotes, setUserNotes] = useState([]);
    const [notes, setNotes] = useState([]);
    const [notas, setNotas] = useState([])
    const [collectionName, setCollectionName] = useState('');
    const navigate = useNavigate();

  useEffect(() => {
    const fetchUserNotes = async () => {
      try {
        const collectionData = await collectionServiceInstance.getCollectionById(collectionId);
        if(collectionData.data){
            setCollectionName(collectionData.data.name);
            setNotes(collectionData.data.notes);
            console.log('notes:', notes)
        }
        if(collectionData.data.error){
            console.log('Error al obtener las notas de la colección:', collectionData.data.error);
        }
        const userData = await UserServiceInstance.getProfile();
        const userId = userData.data._id;
        if(userId){
            const userNotesData = await NoteServiceInstance.getUserNotes(userId);
            console.log('userNotesData:', userNotesData.data)
            if(userNotesData.data){
                const ids = userNotesData.data.map(note => note._id);
                console.log('ids:', ids)
                const filtered = ids.filter(note => !notes.includes(note));
                console.log('filtered:', filtered)
                setUserNotes(filtered);
                console.log('user:', userNotes)
            }
            if(userNotesData.data.error){
                console.log('Error al obtener las notas del usuario:', userNotesData.data.error);
            }
        } if(userData.data.error){
            console.log('Error al obtener el usuario:', userData.data.error);
        }
      } catch (error) {
        console.error('Error al obtener las notas del usuario:', error);
      }
    };

    fetchUserNotes();
  },[collectionId]);

  useEffect(() => {
    console.log("notEs",notes)
  }, [notes]);

  const handleSubmit = () => {
    const newCollection = {
      name: collectionName,
      notes: notes
    };
    collectionServiceInstance.updateCollectionById(collectionId, newCollection);
    navigate('/collections');
  }
  const handleCancel = () => {
    navigate('/collections');
  }

    return (
      <div>
        <div>
          <label htmlFor="collectionName">Collection name:</label>
          <input
            type="text"
            id="collectionName"
            name="collectionName"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="notes">Notes:</label>
          <TransferList
            setNotes={setNotes}
            izq={userNotes}
            der={notes}
          />
        </div>
        <div>
          <button onClick={handleCancel}>Cancelar</button>
          <button onClick={handleSubmit}>Aceptar</button>
        </div>
      </div>
    );
}

export default CollectionComponent;
