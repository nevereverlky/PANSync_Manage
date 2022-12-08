import {HashRouter, Routes, Route} from 'react-router-dom'

import Login from './pages/login/login'
import Admin from './pages/admin/admin'
import Client from './pages/client/client'
import Android from './pages/android/android'

function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/android' element={<Android/>}/>
        <Route path='/admin/*' element={<Admin/>}/>
        <Route path='/*' element={<Client/>}/>
      </Routes>
    </HashRouter>
  );
}

export default App;
