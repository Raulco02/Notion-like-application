import React, { useState, useEffect } from "react";
import "./Menu.css";
import Navbar from "../Navbar/Navbar";
import SignUpBox from "../Signup/SignupBox";
import UserServiceInstance from "../../services/UserService";
import collectionServiceInstance from "../../services/CollectionService";
import { useNavigate } from "react-router-dom";
import ListComponent from "../ListComponent";

const MenuComponent2 = ({ menuItem, children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [usersDictionary, setUsersDictionary] = useState({});
  const [collectionsList, setCollectionsList] = useState([]);
  const [collectionsDictionary, setCollectionsDictionary] = useState({}); // Lista de elementos para Collections
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
    if (menuItem === "users") {
      try {
        const handleUsers = async () => {
          const response = await UserServiceInstance.getUsers();
          console.log(response);
          const users = response.data.map((user) => user.userName);
          const usersDict = response.data.reduce((acc, dic) => {
            acc[dic.userName] = dic._id;
            return acc;
            }, {});
          setUsersList(users);
          setUsersDictionary(usersDict);
        };
        handleUsers();
      } catch (error) {
        console.error("Error al registrarse:", error);
      }
    } else if (menuItem === "collections") {
      try {
        const handleCollections = async () => {
          const response = await collectionServiceInstance.getUserCollections();
          const collections = response.data.map(
            (collection) => collection.name
          );
          const collectionsDict = response.data.reduce((acc, collection) => {
            acc[collection.name] = collection._id;
            return acc;
            }, {});
          setCollectionsList(collections);
          setCollectionsDictionary(collectionsDict);
        };
        handleCollections();
      } catch (error) {
        console.error("Error al registrarse:", error);
      }
    }
  }, [menuItem]);

  const handleCollections = () => {
    navigate("/collections");
  };

  const handleUsers = () => {
    navigate("/usersManagement");
  };
  const handleNotes = () => {
    navigate("/noteMenu");
  };

  const handleItemClick = (item) => {
    if (menuItem === "users") {
      const id = usersDictionary[item]
      navigate(`/user/${id}`);
    } else if (menuItem === "collections") {
      const id = collectionsDictionary[item]
      navigate(`/collection/${id}`);
    }
  };
  const handleMasClickCollections = () => {
    navigate('/collection/new');
  }
  const handleMasClickUsers = () => {
    navigate('/user/new');
  }

  return (
    <div className="background-menu">
      <div className="navbar-menu">
        <Navbar isAdmin={isAdmin} />
      </div>
      <div className="content-background-menu">
        {menuItem === "users" && (
          <ListComponent items={usersList} onItemClick={handleItemClick} onMasClick={handleMasClickUsers} />
        )}
        {menuItem === "collections" && (
          <ListComponent
            items={collectionsList}
            onItemClick={handleItemClick}
            onMasClick={handleMasClickCollections}
          />
        )}
        {menuItem === "main" && (
          <React.Fragment>
            <button className="btn-menu" onClick={handleNotes}>
              Notes
            </button>
            <button className="btn-menu" onClick={handleCollections}>
              Collections
            </button>
            {isAdmin && (
              <button className="btn-menu" onClick={handleUsers}>
                Users Management
              </button>
            )}
          </React.Fragment>
        )}
        {(menuItem === 'collection' || menuItem === 'user') && React.Children.map(children, child => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child);
                    }
                    return child;
                })}
      </div>
    </div>
  );
};

export default MenuComponent2;
