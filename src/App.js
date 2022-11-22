import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Login from './pages/login/login'
import Admin from './pages/admin/admin'
import Client from './pages/client/client'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/admin/*' element={<Admin/>}/>
        <Route path='/*' element={<Client/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
