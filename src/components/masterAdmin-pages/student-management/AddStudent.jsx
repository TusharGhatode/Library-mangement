import React from 'react'
import Dashboard from '../../Dashboard'
import StudenTable from './StudenTable'
import AddButton from './AddButton'

const AddStudent = () => {
  return (
    <div>
        <Dashboard table ={<StudenTable/>} addButton={<AddButton/>}/>
    </div>
  )
}

export default AddStudent