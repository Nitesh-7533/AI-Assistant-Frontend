import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../context/userContext'
import axios from 'axios'

function Customize2() {

 const ctx = useContext(userDataContext)
 if (!ctx) {
  console.error('userDataContext is undefined — make sure the Provider wraps this component')
  return null // or a loading UI
 }
 const { userData, backendImage, selectedImage, serverUrl, setUserData } = ctx
 const navigate = useNavigate()

 const [assistantName, setAssistantName] = useState(userData?.assistantName || "")
 const [loading, setLoading] = useState(false)



 const handleUpdateAssistant = async () => {
  try {
   setLoading(true)
   let formData = new FormData()
   formData.append("assistantName", assistantName)
   if (backendImage) {
    formData.append("assistantImage", backendImage)
   } else {
    formData.append("imageUrl", selectedImage)
   }
   const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true })
   setUserData(result.data)
   console.log(result.data)
   navigate("/")
  } catch (error) {
   console.log(error)
  } finally {
   setLoading(false)
  }
 };

 return (
  <div className='w-full h-screen bg-gradient-to-t from-black via-[#000000ba] to-[#00bbff6e]  flex justify-center items-center flex-col p-5 gap-5 '>


   <h2 className="   text-4xl md:text-5xl font-extrabold mb-10 text-white">
    Enter your <span className=" text-4xl   md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-gradient-x drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] ">Assistant Name</span>
   </h2>
   <input
    onChange={(e) => setAssistantName(e.target.value)} value={assistantName}
    className=' max-w-2/5 w-full h-16 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-5 rounded-full text-xl' type="text" placeholder='eg-Atlas' />


   {assistantName && <button className='min-w-80 h-16 bg-white rounded-full text-black font-semibold text-xl cursor-pointer'
    disabled={loading}
    onClick={() =>
     handleUpdateAssistant()
    }>{!loading ? "Create your Assistant" : "Loading..."} </button>}

  </div>
 )
}

export default Customize2;
