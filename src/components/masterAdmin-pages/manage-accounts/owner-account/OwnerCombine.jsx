import React from 'react'
import Dashboard from '../../../Dashboard'
import OwnerTable from './OwnerTable'
import OwnerAdd from './OwnerAdd'


const OwnerCombine = () => {
  return (
    <div>
        <Dashboard table={<OwnerTable/>} addButton={<OwnerAdd/>}/>

    </div>
  )
}

export default OwnerCombine