import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BackgroundComponent from './components/BackgroundComponent';
import NoteManagemetComponent from './components/NoteManagemetComponent';
import MenuComponent from './components/Menu/Menu';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import UsersComponent from './components/UsersComponent';
import FriendNotesBackgroundComponent from './components/FriendSharingNotes/FriendNotesBackgroundComponent';

function App() {
  const menuItems = { "users": "users", "collections": "collections", "main": "main", "collection": "collection", "user": "user" };
  return (

    <BrowserRouter>
      <Routes>

        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        {/* <Route path='/usersManagement' element={<MenuComponent2 menuItem={menuItems.users}> </MenuComponent2>} /> */}
        <Route path='/noteMenu' element={<BackgroundComponent> </BackgroundComponent>} />
        <Route path='/note/:noteId' element={<BackgroundComponent> <NoteManagemetComponent /> </BackgroundComponent>} />
        <Route path='/user/:userId' element={<MenuComponent menuItem={menuItems.user}> <UsersComponent /> </MenuComponent>} />
        <Route path='/friendNotes/:friendName/:friendId' element={<FriendNotesBackgroundComponent> </FriendNotesBackgroundComponent>} />
        <Route path='/noteFriend/:friendName/:friendId/:noteId' element={<FriendNotesBackgroundComponent> <NoteManagemetComponent /> </FriendNotesBackgroundComponent>} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
