import React from 'react'
import Dashboard from '../../Dashboard'
import AddButton from './AddButton'
import ReturnTable from './ReturnTable'

const Combined = () => {
  return (
    <div>
    <Dashboard table={<ReturnTable/>} addButton={<AddButton/>}/>

    </div>
  )
}

export default Combined