import React from 'react'
import Dashboard from '../../Dashboard'
import ApproveTable from './ApproveTable'
import AddButton from './AddButton'

const Approval = () => {
  return (
    <div>
        <Dashboard table = {<ApproveTable/>} addButton={<AddButton/>}/>
    </div>
  )
}

export default Approval