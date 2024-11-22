import React from 'react'
import Dashboard from '../../Dashboard'

import AddStudentCenter from ".././Addcenter/AddStudentCenter";
import AddButton from './AddButton';

const AddCenter = () => {
  return (
    <div>
        <Dashboard table={<AddStudentCenter/>} addButton={<AddButton/>}/>
    </div>
  )
}

export default AddCenter