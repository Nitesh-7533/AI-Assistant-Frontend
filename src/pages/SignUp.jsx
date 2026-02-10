import React, { useContext, useState } from 'react'
import authBg from "../assets/authBg.png"
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { Navigate, useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/userContext';
import axios from "axios"




function SignUp() {

 const [showPassword, setShowPassword] = useState(false)
 const navigate = useNavigate()
 const [name, setName] = useState("")
 const [email, setEmail] = useState("")
 const [password, setPassword] = useState("")
 const [loading, setLoading] = useState(false)
 const [err, setErr] = useState("")

 const { serverUrl, userData, setUserData } = useContext(userDataContext)

 const handleSignUp = async (e) => {
  e.preventDefault()
  setErr("")
  setLoading(true)
  try {
   const result = await axios.post(`${serverUrl}/api/auth/signup`, {
    name, email, password
   }, { withCredentials: true })
   setUserData(result.data)
   setLoading(false)
   navigate("/customize")
  } catch (error) {
   setUserData(null)
   setLoading(false)
   setErr(error.response.data.message)
  }

 }

 return (

  <div className='w-full h-[100vh] bg-cover bg-center flex justify-center items-center' style={{ backgroundImage: `url(${authBg})` }}>


   <form
    onSubmit={handleSignUp}
    className='w-[90%] h-[600px] max-w-[500px]
 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-8 shadow-lg shadow-black-950 flex flex-col items-center justify-center gap-10 px-5'>

    <h2 className="text-white text-3xl font-semibold mb-8 ">Register to <span className='text-black'>Virtual Assistant</span></h2>

    <input
     value={name}
     required onChange={(e) => setName(e.target.value)}
     className='w-full h-16 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-5 rounded-full text-xl' type="text" placeholder='Enter your name' />

    <input
     value={email}
     onChange={(e) => setEmail(e.target.value)}
     className='w-full h-16 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-5 rounded-full text-xl' type="email" placeholder='Enter your Email' />

    <div
     className='w-full h-16 border-2 border-white bg-transparent text-white rounded-full text-xl  relative'>
     <input
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className=' w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-5 py-5'
      type={showPassword ? "text" : "password"}
      placeholder='Enter your password' />
     {!showPassword && <IoEye className='absolute top-5 right-5 text-white w-6 h-6 cursor-pointer ' onClick={() => setShowPassword(true)} />}

     {showPassword && <IoEyeOff className='absolute top-5 right-5 text-white w-6 h-6  cursor-pointer' onClick={() => setShowPassword(false)} />
     }
    </div>
    {err.length > 0 && <p className='text-red-600 text-xl' >
     *{err}
    </p>}
    <button
     disabled={loading}
     className='min-w-36 h-16 bg-white rounded-full text-black font-semibold text-xl'>{loading ? "Loading.." : "Sign In"}</button>

    <p className='text-white text-xl cursor-pointer' onClick={() => navigate("/signin")}>Already have an account ? <span className='text-blue-500'>Sing In</span></p>
   </form>

  </div>
 )
}

export default SignUp;