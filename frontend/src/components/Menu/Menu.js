import React, { useState, useEffect } from "react";
import "./Menu.css";
import Navbar from "../Navbar/Navbar";
import UserServiceInstance from "../../services/UserService";
import { useNavigate } from "react-router-dom";

const MenuComponent = ({ menuItem, children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
 
  const navigate = useNavigate();
  useEffect(() => {
    const httpId = sessionStorage.getItem("httpId");
    if (!httpId) {
      navigate("/");
    } else {
      const getUser = async () => {
        try {
          const user = await UserServiceInstance.getProfile();
          if (user.data.role === "a") {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error("Error al obtener el usuario:", error);
        }
      };
      getUser();
    }
    
  });


  const handleUsers = () => {
    navigate("/usersManagement");
  };
  const handleNotes = () => {
    navigate("/noteMenu");
  };

  return (
    <div className="background-menu">
      <div className="navbar-menu">
        <Navbar isAdmin={isAdmin} />
      </div>
      <div className="content-background-menu">

        {menuItem === "main" && (
          <React.Fragment>
            <button className="btn-menu" onClick={handleNotes}>
              Notes
            </button>

            {isAdmin && (
              <button className="btn-menu" onClick={handleUsers}>
                Users Management
              </button>
            )}
          </React.Fragment>
        )}

      </div>
    </div>
  );
};

export default MenuComponent;
