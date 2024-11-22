import React from 'react'
import AddBook from './AddBook'
import Dashboard from '../../Dashboard'
import AddButton from './AddButton'
const ManageBook = () => {
  return (
    <div>
        <Dashboard table={<AddBook/>} addButton={<AddButton/>}/>
        
    </div>
  )
}

export default ManageBook