import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom'
import StorageHome from './home';
import StorageAdd from './add';
import StorageUpdate from './update';
import './storage.less';

function Storage() {

    return (
      <Routes>
        <Route path='/' element={<StorageHome/>}/>
        <Route path='/add' element={<StorageAdd/>}/>
        <Route path='/update' element={<StorageUpdate/>}/>
        <Route path="/*" element={<Navigate to="/admin/storage" />} />
      </Routes>
    );
}
  
  export default Storage;
  