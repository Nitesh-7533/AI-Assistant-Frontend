import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

function Card({ image }) {

 const { selectedImage, setSelectedImage, setBackendImage, setFrontendImage } = useContext(userDataContext)

 console.log("Selected Image is:", selectedImage);

 return (
  <div
   onClick={() => {
    setSelectedImage(image)
    setBackendImage(null)
    setFrontendImage(null)
   }}
   className={`w-16 h-36 lg:w-48 lg:h-64 bg-[#0000ff68] border-2 rounded-2xl overflow-hidden cursor-pointer transition-all
        ${selectedImage === image
     ? "border-4 border-white shadow-2xl shadow-pink-800"
     : "border-white/20"}
      `}
  >
   <img src={image} className='h-full w-full object-cover' />
  </div>
 )
}

export default Card
