import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BackgroundComponent from './components/BackgroundComponent';
import NoteManagemetComponent from './components/NoteManagemetComponent';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/menu' element={<BackgroundComponent> </BackgroundComponent>} />
        <Route path='/note/:noteId' element={<BackgroundComponent> <NoteManagemetComponent/> </BackgroundComponent>} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
