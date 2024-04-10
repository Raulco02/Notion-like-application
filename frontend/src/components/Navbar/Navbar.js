import React from 'react';
import './Navbar.css'; // Importa el archivo CSS para aplicar estilos al navbar

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-left">
        {/* Aquí puedes agregar cualquier contenido que quieras a la izquierda */}
        <button className="navbar-button">Home</button>
      </div>
      <div className="navbar-right">
        {/* Botones a la derecha */}
        <button className="navbar-button">Collections</button>
        <button className="navbar-button">Users Management</button>
        <button className="navbar-button">Logout</button>
      </div>
    </div>
  );
}

export default Navbar;