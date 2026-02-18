import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"
import { TfiMenu } from "react-icons/tfi";
import { RxCross1 } from "react-icons/rx";

function Home() {

 const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
 const navigate = useNavigate()
 const [listening, setListening] = useState(false)
 const [userText, setUserText] = useState("")
 const [aiText, setAiText] = useState("")
 const [hem, setHem] = useState(false)
 const isSpeakingRef = useRef(false)
 const recognitionRef = useRef(null)
 const isRecognizingRef = useRef(false)
 const synth = window.speechSynthesis


 const handleLogOut = async () => {
  try {
   const result = await axios.get(`${serverUrl}/api/auth/logout`, {
    withCredentials: true
   })
   setUserData(null)
   navigate("/signup")
  } catch (error) {
   setUserData(null)
   console.log(error)
   navigate("/signup")
  }
 }



 const startRecognition = () => {
  if (!isSpeakingRef.current && !isRecognizingRef.current) {
   try {
    recognitionRef.current?.start()
    console.log("Recognition request to start")
   } catch (error) {
    if (error.name !== "InvalidStateError ") {
     console.log("Recognition error:", error)
    }
   }
  }
 }

 const speak = (text) => {
  // Pehle se bol raha ho toh use turant band karo
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "hi-IN";
  utterance.rate = 1.0; // Normal speed (na zyada fast na slow)
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();

  // Sabse pehle "Google हिन्दी" dhundo (Ye female voice hoti hai aur smooth chalti hai)
  const preferredVoice = voices.find(v => v.name === "Google हिन्दी") ||
   voices.find(v => v.lang === "hi-IN" && v.name.includes("Google")) ||
   voices.find(v => v.lang === "hi-IN");

  if (preferredVoice) {
   utterance.voice = preferredVoice;
   console.log("Using Voice:", preferredVoice.name); // Debugging ke liye
  }

  isSpeakingRef.current = true;

  utterance.onstart = () => {
   // Bolte waqt microphone band rakho taaki assistant apni hi awaaz na sun le
   if (recognitionRef.current) {
    recognitionRef.current.stop();
   }
  };


  // Bolna khatam karne ke baad thoda gap dekar dubara sunna shuru karein
  utterance.onend = () => {
   isSpeakingRef.current = false;
   setAiText("")
   setTimeout(() => {
    startRecognition();
   }, 800);
  };

  synth.cancel();   // ⭐pahel se koi spech ho to band karo
  synth.speak(utterance);
 };


 //gemini se data le kar use karne ke
 const handleCommand = (data) => {
  const { type, userInput, response } = data
  speak(response)


  if (type === 'google_search') {
   const query = encodeURIComponent(userInput);
   window.open(`https://www.google.com/search?q=${query}`, '_blank');
  }

  if (type === 'youtube_search') {
   const query = encodeURIComponent(userInput);
   window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  }

  if (type === 'youtube_play') {
   const query = encodeURIComponent(userInput);
   window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  }


  if (type === 'open_instagram') {
   window.open(`https://www.instagram.com/`, '_blank');
  }

  if (type === 'open_facebook') {
   window.open(`https://www.google.com/`, '_blank');
  }

  if (type === 'calculator_open') {
   window.open('calculator://', '_self');
  }

  if (type === 'open_weather') {
   window.open(`https://www.google.com/search?q=weather`, '_blank');
  }
 }



 useEffect(() => {

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = new SpeechRecognition()
  recognition.continuous = true
  recognition.lang = 'en-US'

  recognition.interimResult = false;
  recognitionRef.current = recognition

  let isMounted = true;


  //start recgition after 1 second
  const startTimeout = setTimeout(() => {
   if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
    try {
     recognition.start();
     console.log("Recognition request to start")
    } catch (e) {
     if (e.name !== "InvalidStateError") {
      console.error(e);
     }
    }
   }
  }, 1000)

  // Check User sepak or note

  // const safeRecognition = () => {
  //  if (!isSpeakingRef.current && !isRecognizingRef.current) {
  //   try {
  //    recognition.current?.start();
  //    console.log("Recognition requested to start")
  //   } catch (error) {
  //    if (error.name !== "InvalidStateError") {
  //     console.log("Start erroe :", error)
  //    }
  //   }
  //  }
  // }

  recognition.onstart = () => {
   console.log("Recognition started");
   isRecognizingRef.current = true;
   setListening(true);
  }

  recognition.onend = () => {
   isRecognizingRef.current = false;
   setListening(false);
   if (isMounted && !isSpeakingRef.current) {
    setTimeout(() => {
     if (isMounted) {
      try {
       recognition.start();
       console.log("Recognition restart")
      } catch (e) {
       if (e.name !== "InvalidStateError") console.error(e)
      }
     }
    }, 1000);
   }
  }

  recognition.onerror = (event) => {
   console.warn("Recognition error:", event.error);
   isRecognizingRef.current = false;
   setListening(false);
   if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
    setTimeout(() => {
     if (isMounted) {
      try {
       recognition.start();
       console.log("Recognition restarted after error ")
      } catch (e) {
       if (e.name !== "InvalidStateError") console.error(e)
      }
     }
    }, 1000)
   }
  }



  recognition.onresult = async (e) => {
   const transcript = e.results[e.results.length - 1][0].transcript.trim()
   console.log(transcript)

   if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
    setAiText("")
    setUserText(transcript)
    recognition.stop()
    isRecognizingRef.current = false
    setListening(false)
    const data = await getGeminiResponse(transcript)
    console.log(data)
    handleCommand(data)
    setAiText(data.response)
    setUserText("")
   }

  }

  // const fallback = setInterval(() => {
  //  if (!isSpeakingRef.current && !isRecognizingRef.current) {
  //   safeRecognition()
  //  }
  // }, 10000)
  // safeRecognition()

  return () => {
   isMounted = false;
   clearTimeout(startTimeout)
   recognition.stop()
   setListening(false)
   isRecognizingRef.current = false

  }


 }, [])



 return (
  <div className='w-full h-screen bg-gradient-to-t from-black via-[#000000] to-[#0f69a4d4]  flex justify-center items-center flex-col gap-2 overflow-hidden '>

   {/* hamburger log out in out */}

   <TfiMenu className='lg:hidden text-white absolute top-5 right-5 w-6 h-6' onClick={() => setHem(true)} />

   <div className={`absolute top-0 w-full h-full bg-[#0000003d] backdrop-blur-lg p-5 flex flex-col gap-5 items-start ${hem ? "translate-x-0" : "translate-x-full"} transition-transform  duration-300  lg:hidden`}>

    <RxCross1 className=' text-white absolute top-5 right-5 w-6 h-6' onClick={() => setHem(false)} />

    <button
     onClick={handleLogOut}
     className='min-w-36 h-16    bg-white rounded-full text-black font-semibold text-xl cursor-pointer'>Log Out</button>

    <button
     onClick={() => { navigate("/customize"), window.location.reload() }}

     className='min-w-60 h-16 px-5 py-2.5  bg-white rounded-full text-black font-semibold text-xl cursor-pointer'>Customize your Assistant</button>


    {/* For User History */}
    <div className='w-full h-0.5 bg-gray-400'></div>
    <h1 className=' text-white font-semibold text-2xl'>History</h1>
    <div className=' w-full h-14 overflow-y-auto  flex-col gap-5  '>
     {userData?.history?.map((his, index) => (
      <span key={index} className="block text-xl text-gray-300 truncate">
       {his}
      </span>
     ))}
    </div>
   </div>

   <button
    onClick={handleLogOut}
    className='min-w-36 h-16 absolute hidden lg:block top-5 right-5  bg-white rounded-full text-black font-semibold text-xl cursor-pointer'>Log Out</button>

   <button
    onClick={() => { navigate("/customize"), window.location.reload() }}

    className='min-w-60 h-16 px-5 py-2.5 absolute hidden lg:block top-24 right-5 bg-white rounded-full text-black font-semibold text-xl cursor-pointer'>Customize your Assistant</button>


   <div className='w-80 h-96 flex justify-center items-center overflow-hidden  rounded-2xl shadow-lg '>
    <img src={userData?.assistantImage} alt="" className='h-full object-cover' />
   </div>

   <h1 className=" text-2xl   md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-purple-500 to-pink-500 animate-gradient-x drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] ">I'm {userData?.assistantName}</h1>
   {!aiText && <img src={userImg} alt='' className='w-52 ' />}
   {aiText && <img src={aiImg} alt='' className='w-52 ' />}
   <h1 className='text-white text-2xl font-semibold text-wrap'> {userText ? userText : aiText ? aiText : null}</h1>
  </div>
 )
}

export default Home
