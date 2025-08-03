import React, { useState } from 'react'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'
import { useNavigate } from 'react-router'
import { ToastContainer, toast } from 'react-toastify';
export default function Login() {
    const notify = () => toast("login failed");
    const navigate = useNavigate()
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const handleSubmit = () => {
        console.log(username,password)
        axios.post('http://localhost:3000/api/users/login',{email:username,password:password}).then(res => {
            secureLocalStorage.setItem('token',res.data.token)
            navigate('/')
        }).catch(err => {
            console.log(err)
            notify()
        })
    }
  return (
    <div>
        <h1>Login</h1>

            <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type='submit' onClick={handleSubmit}>Login</button>
            <ToastContainer />
    </div>
  )
}
