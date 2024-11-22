import React from 'react'
import Dashboard from '../../../Dashboard'

import AccountTable from './accountTable';
import AddButton from './addButton';

const AddAccount = () => {
  return (
    <div>
        <Dashboard table={<AccountTable/>} addButton={<AddButton/>}/>
     

    </div>
  )
}

export default AddAccount