import React from 'react'
import Dashboard from '../../Dashboard'
import AddTable from './AddTable'
import AddButton from './AddButton'
const AddManager = () => {
  return (
    <div>
      <Dashboard table={<AddTable/>} addButton={<AddButton/>}/>
    </div>
  )
}

export default AddManager