import React from 'react';
import './Navbar.css'; // Importa el archivo CSS para aplicar estilos al navbar
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate para redirigir a otras páginas
import UserServiceInstance from '../../services/UserService'; // Importa el servicio UserService para hacer logout

function Navbar({isAdmin}) {
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  const handleClickUsers = () => {
    navigate('/usersManagement'); 
  }

  const handleClickLogout = () => {
    sessionStorage.removeItem('httpId'); //No parece que funcione, lo sigue mandando
    async function logout() {
      try {
        const response = await UserServiceInstance.logout();
        console.log(response.data.message);
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };
    logout(); 
    navigate('/');
  }
  return (
    <div className="navbar">

      <div className="navbar-right">
        {/* Botones a la derecha */}

        {isAdmin && <button onClick={handleClickUsers} className="navbar-button">Users Management</button>}
        <button  onClick={handleClickLogout} className="navbar-button">Logout</button>
      </div>

    </div>
  );
}

export default Navbar;