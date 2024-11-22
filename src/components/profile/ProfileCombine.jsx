import React from 'react'
import Dashboard from '../Dashboard'
import Profile from './Profile'
import AddButton from './AddButton'

const ProfileCombine = () => {
  return (
    <div>
         <Dashboard table={<Profile/>} addButton={<AddButton/>}/>
    </div>
  )
}

export default ProfileCombine