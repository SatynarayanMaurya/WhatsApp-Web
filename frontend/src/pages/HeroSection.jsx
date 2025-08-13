import React from 'react'
import LeftSidebar from '../components/LeftSidebar'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import socket from "../Utils/socket"
import { addMessage, setAllArrangedChatId, setAllChatId, setAllMessages, setFullChatHistory, setLoading, setUnread, setUserOffline, setUserOnline } from '../Redux/Slices/userSlice';
import { apiConnector } from '../services/apiConnector';
import { chatEndpoints } from '../services/apis';
import { toast } from 'react-toastify';

function HeroSection() {

  const dispatch = useDispatch()
  const userDetails = useSelector((state) => state.user.userDetails); // adjust based on your auth state
  const allChatId = useSelector((state)=>state.user.allChatId)
  const allArrangedChatId = useSelector((state)=>state.user.allArrangedChatId)
  const allMessages = useSelector((state)=>state.user.allMessages)
  const getAllChatId = async ()=>{
    try{
      if(allChatId && allArrangedChatId) return;
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
    getAllChatId();
    getAllMessages()
  },[userDetails])

  const getAllMessages = async ()=>{
    try{
      dispatch(setLoading(true))
      const result = await apiConnector("GET",chatEndpoints.GET_ALL_MESSAGES)
      dispatch(setAllMessages(result?.data?.allMessages))
      dispatch(setLoading(false))

    }
    catch(error){
      console.log("Error in getting all the messages : ",error)
      dispatch(setLoading(false))
      toast.error(error?.response?.data?.message || error.message || "Error in getting all the messages.")
    }
  }

  // Socket for handling receive message online offline status
  useEffect(() => {
    if (!userDetails?._id) return;

    const handleReceive = (data) => {
      dispatch(addMessage({ chatId: data.chatId, message: data }));
    };

    const handleOnline = (data) => {
      dispatch(setUserOnline({ userId: data?.userId }));
    };

    const handleOffline = (data) => {
      dispatch(setUserOffline({ userId: data?.userId }));
    };

    socket.emit("join", userDetails?._id);

    socket.on("receiveMessage", handleReceive);
    socket.on("userOnline", handleOnline);
    socket.on("userOffline", handleOffline);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("userOnline", handleOnline);
      socket.off("userOffline", handleOffline);
    };
  }, [userDetails?._id,dispatch]);

  useEffect(()=>{
    const filteredMessage = allMessages?.filter((msg)=>msg?.seen === false)
    
    const unread = filteredMessage?.reduce((acc, msg) => {
    const { chatId, createdAt } = msg;

    if (!acc[chatId]) {
      acc[chatId] = {
        count: 0,
        message: "",
        lastUpdated: ""
      };
    }

    // Increment count
    acc[chatId].count += 1;

    // Update last message & timestamp if newer
    if (
      !acc[chatId].lastUpdated ||
      new Date(createdAt) > new Date(acc[chatId].lastUpdated)
    ) {
      acc[chatId].message = msg;
      acc[chatId].lastUpdated = createdAt;
    }

    return acc;
    }, {});
    
    const fullChatDetails = allMessages?.reduce((acc, msg) => {
    const { chatId } = msg;

    if (!acc[chatId]) {
      acc[chatId] = [];
    }

    // Increment count
    acc[chatId].push(msg);


    return acc;
    }, {});


    dispatch(setFullChatHistory(fullChatDetails))

    dispatch(setUnread(unread))
    
  },[allMessages])



  return (
    <div className='flex justify-between w-full'>
      <div className=' lg:w-[32%] w-[25rem] flex-shrink-0'>
        <LeftSidebar/>
      </div>

      <div className=' lg:w-[68%] w-[40rem] flex-shrink-0'>
        <Outlet/>
      </div>
    </div>
  )
}

export default HeroSection
