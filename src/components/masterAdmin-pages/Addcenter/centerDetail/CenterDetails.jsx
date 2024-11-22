import React from 'react'
import Dashboard from '../../../Dashboard'
import AddButton from './AddButton'
import DetailTable from './DetailTable'

const CenterDetails = () => {
  return (
    <div>
        <Dashboard table={<DetailTable/>} addButton={<AddButton/>}/>
    </div>
  )
}

export default CenterDetails