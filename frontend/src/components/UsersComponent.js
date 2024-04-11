import React, { useState, useEffect } from "react";
import TransferList from "./TransferList";
import NoteServiceInstance from "../services/NoteService";
import collectionServiceInstance from "../services/CollectionService";
import UserServiceInstance from "../services/UserService";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const UsersComponent = () => {
  const { userId } = useParams();
  const [userName, setUserName] = useState([]);
  const [email, setEmail] = useState([]);
  const [pwd1, setPwd1] = useState([]);
  const [pwd2, setPwd2] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userId !== "new") {
          const userData = await UserServiceInstance.getUserById(userId);
          if (userData.data) {
            setUserName(userData.data.userName);
            setEmail(userData.data.email);
            console.log("user:", userData.data);
          }
          if (userData.data.error) {
            console.log(
              "Error al obtener las notas de la colección:",
              userData.data.error
            );
          }
        }
      } catch (error) {
        console.error("Error al obtener las notas del usuario:", error);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = () => {
    if(userId !== "new"){
        const newUser = {
        _id: userId,
        userName: userName,
        email: email,
        };
        UserServiceInstance.updateUserById(newUser);
    }else{
        const newUser = {
        userName: userName,
        email: email,
        password: pwd1,
        };
        UserServiceInstance.createUser(newUser);
    }
    navigate("/usersManagement");
  };
  const handleCancel = () => {
    navigate("/usersManagement");
  };

  return (
    <div>
      <div>
        <label htmlFor="collectionName">User Name:</label>
        <input
          type="text"
          id="collectionName"
          name="collectionName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="collectionName">Email:</label>
        <input
          type="text"
          id="Email"
          name="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {userId === "new" && (
        <div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={pwd1}
              onChange={(e) => setPwd1(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={pwd2}
              onChange={(e) => setPwd2(e.target.value)}
            />
          </div>
        </div>
      )}
      <div>
        <button onClick={handleCancel}>Cancelar</button>
        <button onClick={handleSubmit}>Aceptar</button>
      </div>
    </div>
  );
};

export default UsersComponent;
