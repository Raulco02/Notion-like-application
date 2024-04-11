import React from 'react';
import './Navbar.css'; // Importa el archivo CSS para aplicar estilos al navbar
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate para redirigir a otras páginas
import UserServiceInstance from '../../services/UserService'; // Importa el servicio UserService para hacer logout

function Navbar({isAdmin}) {
  const navigate = useNavigate(); // Inicializa el hook useNavigate
  const handleClickHome = () => {
    navigate('/menu'); 
  }
  const handleClickUsers = () => {
    navigate('/'); 
  }
  const handleClickLogout = () => {
    sessionStorage.removeItem('httpId');
    async function logout() {
      try {
        const response = await UserServiceInstance.logout();
        console.log(response.data.message);
        navigate('/');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };
    logout(); 
  }
  return (
    <div className="navbar">
      <div className="navbar-left">
        {/* Aquí puedes agregar cualquier contenido que quieras a la izquierda */}
        <button onClick={handleClickHome} className="navbar-button">Home</button>
      </div>
      <div className="navbar-right">
        {/* Botones a la derecha */}
        <button onClick={handleClickHome} className="navbar-button">Collections</button>
        {isAdmin && <button onClick={handleClickUsers} className="navbar-button">Users Management</button>}
        <button  onClick={handleClickLogout} className="navbar-button">Logout</button>
      </div>
    </div>
  );
}

export default Navbar;