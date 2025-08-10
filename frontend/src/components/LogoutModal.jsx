import React from 'react'
import { MdOutlineLogout } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { clearUserDetails, setLoading } from '../Redux/Slices/userSlice';
import { apiConnector } from '../services/apiConnector';
import { authEndpoints } from '../services/apis';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from './Spinner';

function LogoutModal({closeModal}) {
    const navigate = useNavigate()
    const loading = useSelector((state)=>state.user.loading)
    const dispatch = useDispatch()
    const logoutHandler = async()=>{
        try{
            dispatch(setLoading(true))
            const result = await apiConnector("POST",authEndpoints.LOGOUT)
            toast.success(result?.data?.message)
            localStorage.clear();
            dispatch(clearUserDetails())
            dispatch(setLoading(false))
            navigate("/login")
        }
        catch(error){
            dispatch(setLoading(false))
            toast.error(error?.response?.data?.message || "Error in logout")
            console.log("Error in logout : ",error)
        }
    }
  return (
    <div className='fixed inset-0 backdrop-blur-md bg-black/30 flex justify-center items-center'>
        {loading && <Spinner/>}
        <div className='w-[30vw] h-[30vh] rounded-2xl items-center bg-white text-black flex flex-col gap-2 p-6'>

            <p className='text-4xl text-red-500'><MdOutlineLogout/></p>
            <p className='text-xl font-semibold'>Logout</p>
            <p>Are you sure you want to logout of your account.</p>
            <div className='flex gap-6 mt-3'>
                <button onClick={closeModal} className='px-6 py-2 rounded-lg border font-semibold text-lg cursor-pointer'>Cancel</button>
                <button onClick={logoutHandler} className='px-6 py-2 rounded-lg bg-red-500 border border-red-600 hover:bg-red-600 transition-all duration-200 text-white cursor-pointer font-semibold text-lg'>Logout</button>
            </div>
        </div>
    </div>
  )
}

export default LogoutModal
