import React from 'react'
import Dashboard from '../.././Dashboard'
import AddButton from './AddButton'
import Cards from './Cards'

const Comine = () => {
  return (
    <Dashboard table={<Cards/>} addButton={<AddButton/>}/>

  )
}

export default Comine