import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BackgroundComponent from './components/BackgroundComponent';
import NoteManagemetComponent from './components/NoteManagemetComponent';
import MenuComponent2 from './components/Menu/Menu2';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import CollectionComponent from './components/CollectionComponent';
import UsersComponent from './components/UsersComponent';

function App() {
  const menuItems = {"users": "users", "collections": "collections", "main": "main", "collection": "collection", "user": "user"};
  return (

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/menu' element={<MenuComponent2 menuItem={menuItems.main}> </MenuComponent2>} />
        <Route path='/usersManagement' element={<MenuComponent2 menuItem={menuItems.users}> </MenuComponent2>} />
        <Route path='/collections' element={<MenuComponent2 menuItem={menuItems.collections}> </MenuComponent2>} />
        <Route path='/noteMenu' element={<BackgroundComponent> </BackgroundComponent>} />
        <Route path='/note/:noteId' element={<BackgroundComponent> <NoteManagemetComponent/> </BackgroundComponent>} />
        <Route path='/collection/:collectionId' element={<MenuComponent2 menuItem={menuItems.collection}> <CollectionComponent/> </MenuComponent2>} />
        <Route path='/user/:userId' element={<MenuComponent2 menuItem={menuItems.user}> <UsersComponent/> </MenuComponent2>} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
