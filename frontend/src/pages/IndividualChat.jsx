import React, { useRef } from 'react'
import ChatHeader from '../components/ChatHeader'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import socket from '../Utils/socket'
import { addMessage, setChatHistory, setCurrentOpenChat, setLoading, setLocalLoading } from '../Redux/Slices/userSlice'
import { apiConnector } from '../services/apiConnector'
import { chatEndpoints } from '../services/apis'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import IndividualChatSkeleton from './IndividualChatSkeleton'

function IndividualChat() {
  const chatContainerRef = useRef(null);
  const currentOpenChatId = useSelector((state)=>state.user.currentOpenChatId)
  const localLoading = useSelector((state)=>state.user.localLoading)
  const [message,setMessage] = useState("")
  const dispatch = useDispatch();
  const [chatId,setChatId] = useState("")
  const userDetails = useSelector((state)=>state.user.userDetails)
  const {id} = useParams()
  const allUsers = useSelector((state)=>state.user.allUsers)
  const findUser = allUsers?.find((user)=>user?._id === id)
  const allMessages = useSelector((state)=>state.user.allMessages)

  const chatHistory = useSelector((state)=>state.user.chatHistory)
  const allArrangedChatId = useSelector((state)=>state.user.allArrangedChatId)

  const sendMessage = () => {
    if (!message.trim()) return;
    
    const messageData = {
      sender: userDetails._id,
      receiver: id,  // ID of the person you're chatting with
      message: message,
      type: "text", // can be 'image', 'video', etc.
      chatId,       // the existing chatId between sender & receiver
      timestamp:Date.now()
    };
    
    const handleReceive = (data) => {
      dispatch(addMessage({ chatId: data.chatId, message: data }));
    };

    socket.emit("sendMessage", messageData); // emit to backend
    handleReceive(messageData)
    setMessage(""); // clear input
  };

  const getChatHistory = async()=>{
    try{
      if(!currentOpenChatId) return;

      if(chatHistory?.[currentOpenChatId]) return ;
      dispatch(setLocalLoading(true))
      // const result = await apiConnector("GET",`${chatEndpoints.GET_CHAT_HISTORY}?chatId=${currentOpenChatId}`)
      const result2 = allMessages?.filter((msg)=>msg?.chatId === currentOpenChatId)
      // dispatch(setChatHistory({chatId:currentOpenChatId,messages:result?.data?.messages}))
      dispatch(setChatHistory({chatId:currentOpenChatId,messages:result2}))
      dispatch(setLocalLoading(false))

    }
    catch(error){
      console.log("Error in getting the chat history : ",error)
      toast.error(error?.response?.data?.message || "Error in getting the chat history")
      dispatch(setLocalLoading(false))
    }
  }
  useEffect(()=>{
    getChatHistory()
  },[chatId,allMessages])

  const getChatId = async ()=>{
    try{
      if(!userDetails?._id) return 
      if(allArrangedChatId?.[id]) {
        setChatId(allArrangedChatId?.[id]?.chatId)
        dispatch(setCurrentOpenChat(allArrangedChatId?.[id]?.chatId))
        return ;
      } ;
      dispatch(setLocalLoading(true))
      const result = await apiConnector("POST",chatEndpoints.GET_OR_CREATE_CHAT_ID,{senderId:userDetails?._id,receiverId:id})
      setChatId(result?.data?.chatId)
      dispatch(setCurrentOpenChat(result?.data?.chatId))
      dispatch(setLocalLoading(false))
    }
    catch(error){
      console.log("Error in getting the chat id : ",error)
      toast.error(error?.response?.data?.message || error.message)
      dispatch(setLocalLoading(false))
    }
  }

  useEffect(()=>{
    getChatId()
  },[id,allArrangedChatId])

  function getDateTimeParts(isoString) {
    const dateObj = new Date(isoString);

    const date = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });

    const time = dateObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });

    return { date, time };
  }


  const [isAutoScroll, setIsAutoScroll] = useState(true);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    // Instantly jump to bottom when chat opens (no smooth scroll)
    container.scrollTop = container.scrollHeight;

    const handleScroll = () => {
      const atBottom =
        Math.abs(
          container.scrollHeight - container.scrollTop - container.clientHeight
        ) < 50; // tolerance
      setIsAutoScroll(atBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [chatId]); // Runs when opening a chat

  useEffect(() => {
    if (isAutoScroll && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight; // instant jump for new messages
    }
  }, [chatHistory?.[chatId]]);


  useEffect(() => {
    if (!currentOpenChatId) return;

    socket.emit("seenMessages", {
      chatId: currentOpenChatId,
      userId: userDetails?._id,
      sender: id
    });

    socket.on("messagesSeen", (messages) => {
      dispatch(setChatHistory({chatId:currentOpenChatId,messages:messages?.updatedMessage}))
    });
  }, [currentOpenChatId]);

  return (
    <div className='text-white'>

      {localLoading && <IndividualChatSkeleton/>}
      
      {/* Chat Header  */}
      <ChatHeader findUser={findUser}/>

      {/* chats  */}
      <div ref={chatContainerRef} className='flex flex-col gap-2 px-20 py-4  h-[82vh] overflow-scroll scrollbar-slim'>

        {
          chatHistory?.[currentOpenChatId]?.map((chat,index)=>{
            return chat?.sender !== userDetails?._id ? <div key={chat?.timestamp+index} className='flex '>
                    <div className='px-4 py-1 lg:max-w-[40vw] max-w-[20rem] pr-[4rem] rounded-lg border bg-[#262524] border-[#333333] relative'>
                      <p>{chat?.message} </p>
                      <p className='text-[11px] text-[#fff9] absolute bottom-0 right-2 whitespace-nowrap'>{getDateTimeParts(chat?.timestamp)?.time} </p>
                    </div>
                  </div>:
                  <div key={chat?.timestamp+index} className='flex justify-end'>
                    <div className='px-4 py-1  lg:max-w-[40vw] max-w-[20rem]  pr-[5.5rem] rounded-lg border bg-[#15603e] border-[#333333] relative'>
                      <p>{chat?.message} </p>
                      <p className='text-[11px] text-[#fff9] absolute bottom-0 right-2 whitespace-nowrap flex gap-2 items-center'>{getDateTimeParts(chat?.timestamp)?.time} 
                        <span className={`${chat?.seen && "text-blue-400"}`}>
                          <span aria-hidden="false" aria-label=" Read " data-icon="msg-dblcheck" className="x1q15gih"><svg viewBox="0 0 16 11" height="11" width="16" preserveAspectRatio="xMidYMid meet" className="" fill="none"><title>msg-dblcheck</title><path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832ZM8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z" fill="currentColor"></path></svg></span>
                        </span>
                      </p>
                    </div>
                  </div>
          })
        }

      </div>

      {/* Sending message  */}
      <div className='flex justify-between gap-2 items-center mt-2 px-2'>
        <input onKeyDown={(e)=>e.key === "Enter" && sendMessage()} type="text" name="" id="" value={message} onChange={(e)=>setMessage(e.target.value)} className='w-full border border-[#454545] bg-[#1d1d1d] outline-none py-3 rounded-sm px-6' placeholder='Type a messsage' />
        <button onClick={sendMessage} className='px-6 py-3 rounded-lg bg-blue-500 text-white'>Send</button>
      </div>
    </div>
  )
}

export default IndividualChat
