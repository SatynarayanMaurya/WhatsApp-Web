import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { setLoading } from '../Redux/Slices/userSlice';
import { apiConnector } from '../services/apiConnector';
import { statusEndpoints } from '../services/apis';
import { toast } from 'react-toastify';
import { setAllStatus, setStatusLoading } from '../Redux/Slices/statusSlice';
import socket from '../Utils/socket';
import IndividualStatusPageSkeleton from './IndividualStatusPageSkeleton';

function StatusLeftSidebar() {
    const dispatch = useDispatch();
    const statusLoading = useSelector((state)=>state.status.statusLoading)
    const allUsers = useSelector((state)=>state.user.allUsers)
    const userDetails = useSelector((state)=>state.user.userDetails)
    const navigate = useNavigate()
    const allStatus = useSelector((state)=>state.status.allStatus)
    const ownStatus = allStatus?.find((status)=>status?.user?._id === userDetails?._id)
    
    function formatTimestampToTime(ms) {
        if (!ms) return ""; // handle empty/null case
        const date = new Date(ms);
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }
    
    const addStatus = async(selectedFile)=>{
        try{
            dispatch(setStatusLoading(true))
            const result = await apiConnector("POST",statusEndpoints.ADD_STATUS,{file:selectedFile},{"Content-Type": "multipart/form-data" })
            toast.success(result?.data?.message)
            dispatch(setStatusLoading(false))
            socket.emit("addStatus")
        }
        catch(error){
            dispatch(setStatusLoading(false))
            toast.error(error?.response?.data?.message || error.message || "Error in updating the status")
            console.log("Error in adding the status : ",error)
        }
    }

    const getAllStatus = async()=>{
        try{
            dispatch(setStatusLoading(true))
            const result = await apiConnector("GET",statusEndpoints.GET_ALL_STATUS)
            dispatch(setAllStatus(result?.data?.allStatus))
            dispatch(setStatusLoading(false))

        }
        catch(error){
            console.log("Error in getting all the status : ",error)
            toast.error(error?.response?.data?.message || error.message || "Error in getting all the status ")
            dispatch(setStatusLoading(false))
        }
    }

    useEffect(()=>{
        getAllStatus()
    },[])


    // Socket for when status was seen 
    useEffect(()=>{
        socket.emit("join", userDetails?._id);
        socket.on("statusSeen",(data)=>{
            dispatch(setAllStatus(data?.updatedStatus))
        })
        socket.on("statusAdded",(data)=>{
            dispatch(setAllStatus(data?.allStatus))
        })
    },[userDetails?._id,dispatch])


  return (
    <div className='border-r border-[#454545] h-screen p-4 px-6 text-white flex flex-col gap-4'>

        {statusLoading && <IndividualStatusPageSkeleton/>}

        <div className='flex justify-between items-center'>
            <p className='text-2xl font-semibold'>Status</p>
            <div className='flex gap-4'>
                
                <div className='p-2 rounded-full   hover:bg-zinc-700 transition-all duration-200 cursor-pointer '>
                    <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="" fill="none"><title>new-chat-outline</title><path d="M9.53277 12.9911H11.5086V14.9671C11.5086 15.3999 11.7634 15.8175 12.1762 15.9488C12.8608 16.1661 13.4909 15.6613 13.4909 15.009V12.9911H15.4672C15.9005 12.9911 16.3181 12.7358 16.449 12.3226C16.6659 11.6381 16.1606 11.0089 15.5086 11.0089H13.4909V9.03332C13.4909 8.60007 13.2361 8.18252 12.8233 8.05119C12.1391 7.83391 11.5086 8.33872 11.5086 8.991V11.0089H9.49088C8.83941 11.0089 8.33411 11.6381 8.55097 12.3226C8.68144 12.7358 9.09947 12.9911 9.53277 12.9911Z" fill="currentColor"></path><path fillRule="evenodd" clipRule="evenodd" d="M0.944298 5.52617L2.99998 8.84848V17.3333C2.99998 18.8061 4.19389 20 5.66665 20H19.3333C20.8061 20 22 18.8061 22 17.3333V6.66667C22 5.19391 20.8061 4 19.3333 4H1.79468C1.01126 4 0.532088 4.85997 0.944298 5.52617ZM4.99998 8.27977V17.3333C4.99998 17.7015 5.29845 18 5.66665 18H19.3333C19.7015 18 20 17.7015 20 17.3333V6.66667C20 6.29848 19.7015 6 19.3333 6H3.58937L4.99998 8.27977Z" fill="currentColor"></path></svg>
                </div>
                
                <div className='p-2 rounded-full   hover:bg-zinc-700 transition-all duration-200 cursor-pointer '>
                    <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="" fill="none"><title>more-refreshed</title><path d="M12 20C11.45 20 10.9792 19.8042 10.5875 19.4125C10.1958 19.0208 10 18.55 10 18C10 17.45 10.1958 16.9792 10.5875 16.5875C10.9792 16.1958 11.45 16 12 16C12.55 16 13.0208 16.1958 13.4125 16.5875C13.8042 16.9792 14 17.45 14 18C14 18.55 13.8042 19.0208 13.4125 19.4125C13.0208 19.8042 12.55 20 12 20ZM12 14C11.45 14 10.9792 13.8042 10.5875 13.4125C10.1958 13.0208 10 12.55 10 12C10 11.45 10.1958 10.9792 10.5875 10.5875C10.9792 10.1958 11.45 10 12 10C12.55 10 13.0208 10.1958 13.4125 10.5875C13.8042 10.9792 14 11.45 14 12C14 12.55 13.8042 13.0208 13.4125 13.4125C13.0208 13.8042 12.55 14 12 14ZM12 8C11.45 8 10.9792 7.80417 10.5875 7.4125C10.1958 7.02083 10 6.55 10 6C10 5.45 10.1958 4.97917 10.5875 4.5875C10.9792 4.19583 11.45 4 12 4C12.55 4 13.0208 4.19583 13.4125 4.5875C13.8042 4.97917 14 5.45 14 6C14 6.55 13.8042 7.02083 13.4125 7.4125C13.0208 7.80417 12.55 8 12 8Z" fill="currentColor"></path></svg>
                </div>
            </div>
        </div>
        
        <div className='relative '>

            <div  className='flex gap-6 items-center cursor-pointer px-4 mt-2'>
                <label htmlFor={`${!ownStatus && "file"}`}  onClick={()=> ownStatus && navigate(`/status/${ownStatus?._id}`)}  className='relative'>

                    <div  className={`${ownStatus ? "border-2 rounded-full border-green-500 p-[2px] ":"border rounded-full"}`}>
                        <img src={userDetails?.profileImage || `https://i.pravatar.cc/101`} alt="" className='w-14 h-12 rounded-full object-cover' />
                    </div>
                    {
                        !ownStatus && 
                        <>
                        <div className='absolute top-8 -right-1 bg-green-500 text-white p-[2px]  rounded-full flex justify-center items-center'>
                            <p className='text-sm'><FaPlus/></p>
                        </div>
                        <input type="file" id='file' className='hidden'   onChange={(e) => {
                            const selectedFile = e.target.files[0];
                            if (selectedFile ) {
                                addStatus(selectedFile); 
                            }
                            }
                        } />
                        </>
                    }
                </label>

                <div onClick={()=> ownStatus && navigate(`/status/${ownStatus?._id}`)} className='flex flex-col  w-full'>
                    <div className='flex justify-between items-center w-full '>
                        <p className='text-[17px]'>{userDetails?.name}</p>
                    </div>
                    <div className='flex justify-between items-center'>
                        <p className='text-sm text-[#a0a0a0]'>{formatTimestampToTime(ownStatus?.createdAt) || ""}</p>
                    </div>
                </div>

            </div>
            
            {
                ownStatus &&
                <label htmlFor='file' className='absolute right-0 top-4 cursor-pointer px-4 py-1 rounded-lg text-white font-semibold bg-green-400'>
                    Update
                    <input type="file" id='file' className='hidden'   onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        if (selectedFile) {
                            addStatus(selectedFile); 
                        }
                    }} />
                </label>
            }
        </div>

        <p className='text-[#a0a0a0] mt-2'>Recent</p>

        {/* All the unseen  */}
        <div className=' flex flex-col gap-6 px-4 max-h-[73vh]  overflow-y-scroll scrollbar-slim'>

            {
                allStatus?.filter((status)=>!status?.views?.some((sta)=>sta?.viewer?._id === userDetails?._id))?.length > 0?
                allStatus?.filter((status)=>!status?.views?.some((sta)=>sta?.viewer?._id === userDetails?._id))?.map((user,index)=>{

                        return  user?.user?._id !== userDetails?._id && <div key={user?._id} onClick={()=>navigate(`/status/${user?._id}`)} className='flex gap-3 items-center cursor-pointer'>
                                <div className='border-2 rounded-full border-green-500 p-[2px]  '>
                                    <img src={user?.user?.profileImage || `https://i.pravatar.cc/10${index}`} alt="" className='w-14 h-12 rounded-full object-cover' />
                                </div>

                                <div className='flex flex-col   w-full'>
                                    <div className='flex justify-between items-center w-full '>
                                        <p className='text-[17px]'>{user?.user?.name}</p>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <p className='text-sm text-[#a0a0a0]'>{formatTimestampToTime(user?.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                }):
                <p className='text-[#a0a0a0] '>No one has posted a status recently</p>
            }
        </div>

        <p className='text-[#a0a0a0] mt-2'>Viewed</p>

        {/* All the viewed  */}
        <div className='mt-3 flex flex-col gap-6 px-4 max-h-[73vh]  overflow-y-scroll scrollbar-slim'>

            {
                allStatus?.filter((status)=>status?.views?.some((sta)=>sta?.viewer?._id === userDetails?._id))?.length > 0 ?
                allStatus?.filter((status)=>status?.views?.some((sta)=>sta?.viewer?._id === userDetails?._id))?.map((user,index)=>{

                        return  user?.user?._id !== userDetails?._id && <div key={user?._id} onClick={()=>navigate(`/status/${user?._id}`)} className='flex gap-3 items-center cursor-pointer'>
                                <div className='border-2 rounded-full border-gray-500 p-[2px]  '>
                                    <img src={user?.user?.profileImage || `https://i.pravatar.cc/10${index}`} alt="" className='w-14 h-12 rounded-full object-cover' />
                                </div>

                                <div className='flex flex-col   w-full'>
                                    <div className='flex justify-between items-center w-full '>
                                        <p className='text-[17px]'>{user?.user?.name}</p>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <p className='text-sm text-[#a0a0a0]'>{formatTimestampToTime(user?.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                }):
                <p className='text-[#a0a0a0] '>You haven’t viewed any statuses yet</p>
            }
        </div>

    </div>
  )
}

export default StatusLeftSidebar
