import React, { useRef, useState } from 'react'
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/image3.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.png"
import { RiImageAddLine } from "react-icons/ri";
import { useContext } from 'react'
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'



function Customize() {

 const { serverUrl, userData, setUserData, backendImage, setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage } = useContext(userDataContext)

 const navigate = useNavigate()
 const inputImage = useRef()

 const handleImage = (e) => {
  const file = e.target.files[0]
  setBackendImage(file)
  setFrontendImage(URL.createObjectURL(file))
 }



 return (
  <div className='w-full h-screen bg-gradient-to-t from-black via-[#000012ba] to-[#00bbffb0]  flex justify-center items-center flex-col p-5 gap-5 '>


   <h2 className="   text-4xl md:text-5xl font-extrabold mb-10 text-white">
    Select your <span className=" text-4xl   md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-gradient-x drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] ">Assistant Image</span>
   </h2>
   <div className='w-full max-w-[75%] flex justify-center items-center flex-wrap gap-4 '>

    <Card image={image1} />
    <Card image={image2} />
    <Card image={image3} />
    <Card image={image4} />
    <Card image={image5} />

    <Card image={image6} />

    <div
     className={`w-16 h-36 lg:w-50 lg:h-64 bg-[#0000ff68] border-2 rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center
       transition-all duration-200 ease-in-out
       hover:shadow-2xl hover:shadow-pink-800 hover:border-4 ${selectedImage === "input"
       ? "border-4 border-white shadow-2xl"
       : "border-white/20"}`}
     onClick={() => { inputImage.current.click(); setSelectedImage("input") }}>

     {!frontendImage && <RiImageAddLine className='text-white  w-6 h-6 ' />}

     {frontendImage && <img src={frontendImage} className='h-full object-cover' />}

    </div>
    <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage} />
   </div>
   {selectedImage && <button className='min-w-36 h-16 bg-white rounded-full text-black font-semibold text-xl cursor-pointer' onClick={() => navigate("/customize2")}> Next</button>}


  </div>
 )
}

export default Customize;
