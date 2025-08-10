import React from 'react'
import LeftSidebar from '../components/LeftSidebar'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import socket from "../Utils/socket"
import { addMessage, setAllArrangedChatId, setAllChatId, setLoading, setUserOffline, setUserOnline } from '../Redux/Slices/userSlice';
import { apiConnector } from '../services/apiConnector';
import { chatEndpoints } from '../services/apis';

function HeroSection() {

  const dispatch = useDispatch()
  const userDetails = useSelector((state) => state.user.userDetails); // adjust based on your auth state

  const getAllChatId = async ()=>{
    try{
      dispatch(setLoading(true))
      const result = await apiConnector("GET",chatEndpoints.GET_ALL_CHAT_ID)
      const arrangedChats = {};

      result?.data?.allChatId?.forEach(chat => {
        if (chat.participants.includes(userDetails?._id)) {
          const secondUserId = chat.participants.find(p => p !== userDetails?._id);
          arrangedChats[secondUserId] = {
            chatId: chat._id,
            ...chat
          };
        }
      });

      dispatch(setAllChatId(result?.data?.allChatId))
      dispatch(setAllArrangedChatId(arrangedChats))
      dispatch(setLoading(false))

    }
    catch(error){
      console.log("Error in getting the chat Id :",error)
      dispatch(setLoading(false))
    }
  }

  useEffect(()=>{
    getAllChatId()
  },[userDetails])

  useEffect(() => {
    if (!userDetails?._id) return;

    const handleReceive = (data) => {
      dispatch(addMessage({ chatId: data.chatId, message: data }));
    };

    socket.emit("join", userDetails._id);

    socket.on("receiveMessage", (data)=>{
      handleReceive(data)
    });

    const handleOnline = (data)=>{
      dispatch(setUserOnline({userId:data?.userId}))
    }
    
    const handleOffline = (data)=>{
      dispatch(setUserOffline({userId:data?.userId}))
    }

    socket.on("userOnline",handleOnline)
    socket.on("userOffline",handleOffline)

    return () => {
      socket.off("receiveMessage",handleReceive);
      socket.off("userOffline",handleOffline)
    };
  }, [userDetails?._id]);

  
  return (
    <div className='flex justify-between w-full'>
      <div className=' w-[32%]'>
        <LeftSidebar/>
      </div>

      <div className=' w-[68%]'>
        <Outlet/>
      </div>
    </div>
  )
}

export default HeroSection
