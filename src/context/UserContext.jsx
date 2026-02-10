import React, { createContext, useEffect, useState } from 'react'
import axios from "axios";

// 1. You MUST export the actual Context object
export const userDataContext = createContext();

function UserContext({ children }) {

 const serverUrl = "http://localhost:8000";


 const [userData, setUserData] = useState(null)
 const [frontendImage, setFrontendImage] = useState(null)
 const [backendImage, setBackendImage] = useState(null)
 const [selectedImage, setSelectedImage] = useState(null)
 const [isInitialized, setIsInitialized] = useState(false)


 const handleCurrentUser = async () => {
  try {
   const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
   setUserData(result.data)
   console.log(result.data)
  } catch (error) {
   setUserData(null)
   console.log(error)
  } finally {
   setIsInitialized(true)
  }
 }



 const getGeminiResponse = async (command) => {

  try {
   const result = await axios.post(`${serverUrl}/api/user/asktoassistant`, { command }, { withCredentials: true })
   return result.data

  } catch (error) {
   console.log(error)
  }

 }



 useEffect(() => {
  handleCurrentUser()
 }, [])

 const value = {
  serverUrl, userData, setUserData, backendImage, setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage, getGeminiResponse, isInitialized, setIsInitialized
 }


 return (
  <userDataContext.Provider value={value}>
   {children}
  </userDataContext.Provider>
 )
}

export default UserContext;