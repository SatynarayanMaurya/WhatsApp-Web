import React, { useState } from 'react'
import proifleImage from "../assets/profile image.jpg"
import { CiEdit } from "react-icons/ci";
import { AiOutlineSave } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { IoCloseOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { MdOutlineLogout } from "react-icons/md";
import LogoutModal from '../components/LogoutModal';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { clearUserDetails, setLoading, setUserDetails } from '../Redux/Slices/userSlice';
import { apiConnector } from '../services/apiConnector';
import { userEndpoints } from '../services/apis';
import Spinner from '../components/Spinner';
function Profile() {
    const dispatch = useDispatch()
    const userDetails = useSelector((state)=>state.user.userDetails)
    const loading = useSelector((state)=>state.user.loading)
    const [name, setName ] = useState("")
    const [about, setAbout ] = useState("")
    const [file,setFile] = useState(null)
    const [isUpdated,setIsUpdated] = useState(false)

    useEffect(()=>{
        setName(userDetails?.name)
        setAbout(userDetails?.about)
    },[userDetails])

    const navigate = useNavigate()
    const [isLogoutModal, setIsLogoutModal] = useState(false)
    const [isEditName, setIsEditName] = useState(false)
    const [isEditAbout, setIsEditAbout] = useState(false)

    const updateProfile = async()=>{
        try{

            dispatch(setLoading(true))
            const result = await apiConnector("PUT",userEndpoints.UPDATE_PROFILE,{name,about})
            toast.success(result?.data?.message )
            dispatch(setLoading(false))
            setIsEditAbout(false)
            setIsEditName(false)
            dispatch(clearUserDetails())
            setIsUpdated(!isUpdated)
        }
        catch(error){
            console.log("Error in updating profile : ",error)
            toast.error(error?.response?.data?.message || "Error in updating the profile")
            dispatch(setLoading(false))
        }
    }

    const getUserDetails = async()=>{
        try{
            if(userDetails) return;
            dispatch(setLoading(true))
            const result = await apiConnector("GET",userEndpoints.GET_USER_DETAILS)
            dispatch(setUserDetails(result?.data?.userDetails))
            dispatch(setLoading(false))
        }
        catch(error){
            toast.error(error?.response?.data?.message || "Error in getting the user details")
            dispatch(setLoading(false))
            console.log("Error in getting the user details : ",error)
        }
    }

    useEffect(()=>{
        getUserDetails()
    },[isUpdated])

    const updateProfilePicture = async(e)=>{
        try{
            if(!file){
                toast.warning("Please select one photo")
                return ;
            }
            dispatch(setLoading(true))
            const result = await apiConnector("PUT",userEndpoints.UPDATE_PROFILE_PICTURE,{image:file}, {"Content-Type": "multipart/form-data" })
            toast.success(result?.data?.message || "Profile Picture updated")
            dispatch(clearUserDetails())
            dispatch(setLoading(false))
            setIsUpdated(!isUpdated)
            setFile(null)

        }
        catch(error){
            console.log("Error in updating the Profile Picture : ",error)
            toast.error(error?.response?.data?.message || "Error in updating the profile Picture")
            dispatch(setLoading(false))
        }
    }
  

  return (
    <div className='text-white flex justify-between h-screen'>
        {loading&& <Spinner/>}
      <div  className=' lg:w-[32%] w-[25rem] p-6 flex flex-col gap-4 border-r border-[#454545] relative'>
        <div className='flex justify-between items-center'>

        <p className='text-xl font-semibold'>Profile</p>
        <p onClick={()=>navigate("/")} className='text-3xl cursor-pointer'><IoCloseOutline/></p>
        </div>

        <div className='flex flex-col items-center mt-8'>
            <div className='relative group w-28 h-28'>
                <img
                src={userDetails?.profileImage ||proifleImage}
                alt="Profile"
                className='w-full h-full object-cover rounded-full'
                />
                
                <label htmlFor="selectImage" className='text-2xl cursor-pointer absolute inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto'>
                <CiEdit/>
                    <input onChange={(e)=>setFile(e.target.files[0])} id='selectImage' type="file" className='hidden' />
                </label>
            </div>

            {
                file !== null &&
                <div className='mt-6 flex items-center gap-5'>
                    <p>{file?.name?.slice(0,15)}</p>
                    <button onClick={updateProfilePicture} className='px-4 py-1 rounded-lg bg-blue-500 text-white font-semibold  cursor-pointer'>Update </button>
                </div> 
            }
        </div>
          
        <div className='flex  gap-6 items-center mt-4'>
            <p className='text-[#a0a0a0]'>Phone : </p>
            <p className=''>{userDetails?.phone}</p>
        </div>

        <div className='flex flex-col gap-6 mt-4'>
            <p className='text-[#a0a0a0]'>Your Name</p>
            <div className='flex justify-between items-center'>
                <input type="text" name="" id="" value={name || ""} onChange={(e)=>setName(e.target.value)} className={` rounded-full ${isEditName && "border px-6 py-2"}  border-[#454545] outline-none`} />
                <div className='text-2xl cursor-pointer'>
                    {
                        !isEditName ?
                        <p onClick={()=>setIsEditName(true)}><CiEdit/></p>:
                        <p onClick={()=>updateProfile()}><AiOutlineSave/></p>
                    }
                </div>
            </div>
            <p className='text-[#a0a0a0] mt-2'>This is not your username or PIN. This name wiil be visible to your WhatsApp Contact.</p>
        </div>

        <div className='flex flex-col gap-4 mt-6'>
            <p className='text-[#a0a0a0]'>About</p>
            <div className='flex justify-between items-center'>
                <textarea spellCheck={false} rows={4} type="text" name="" id="" value={about||""} onChange={(e)=>setAbout(e.target.value)} className={`rounded-xl hide-scrollbar  ${isEditAbout && "border px-4 py-2"}  border-[#454545] outline-none  w-full mr-4 `} />
                <div className='text-2xl cursor-pointer'>
                    {
                        !isEditAbout ?
                        <p  onClick={()=>setIsEditAbout(true)}><CiEdit/></p>:
                        <p  onClick={()=>updateProfile()}><AiOutlineSave/></p>
                    }
                </div>
            </div>
        </div>

        <div onClick={()=>setIsLogoutModal(true)} className='absolute bottom-8 flex gap-2 items-center text-red-500 text-lg cursor-pointer hover:text-red-600 transition-all duration-200'>
            <p><MdOutlineLogout/></p>Logout
        </div>
      </div>

      <div  className=' lg:w-[68%] w-[40rem] flex justify-center items-center'>
        <div className='flex flex-col gap-8 justify-center items-center'>
            <p className='lg:text-[4vw] text-[6rem] text-[#a0a0a0]'><CgProfile/></p>
            <p className='lg:text-[2.5vw] text-[2.5rem] font-light'>Profile</p>
        </div>
      </div>

      {/* Logoout Modal  */}
      <>
        {
            isLogoutModal && 
            <LogoutModal closeModal = {()=>setIsLogoutModal(false)}/>
        }
      </>
    </div>
  )
}

export default Profile
