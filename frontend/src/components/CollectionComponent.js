import React from 'react';
import TransferList from './TransferList';
import NoteServiceInstance from '../services/NoteService';

const ColllectionComponent = ({userId, collectionName, notes}) => {
  const handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  const userNotes = NoteServiceInstance.getUserNotes(userId);

  const handleSubmit = () => {
    console.log('Datos del formulario:', collectionName, notes);
  }
  const handleCancel = () => {
    console.log('Datos del formulario:', collectionName, notes);
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
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="notes">Notes:</label>
          <TransferList
            izq={notes}
            der={[]}
          />
        </div>
        <div>
          <button onClick={handleCancel}>Cancelar</button>
          <button onClick={handleSubmit}>Aceptar</button>
        </div>
      </div>
    );
}

export default ColllectionComponent;
