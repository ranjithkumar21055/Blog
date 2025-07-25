import React from 'react'
import {useDispatch} from 'react-redux'
import authService from '../../appwrite/auth'
import {logout} from '../../store/authSlice'
function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
        })
    }
  return (
    <button className="inline-block px-6 py-2 duration-200 font-medium ml-3 cursor-pointer bg-blue-500 hover:bg-blue-700 rounded-full" onClick={logoutHandler}>Logout</button>
  )
}

export default LogoutBtn