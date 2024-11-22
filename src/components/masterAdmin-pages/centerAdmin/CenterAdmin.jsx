import React from 'react'
import Dashboard from '../../Dashboard'
import AddCenterAdmin from './AddCenterAdmin'

const CenterAdmin = () => {
  return (
    <div>
        <Dashboard table={<AddCenterAdmin/>} />
    </div>
  )
}

export default CenterAdmin