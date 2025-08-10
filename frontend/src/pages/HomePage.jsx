import { Outlet } from 'react-router-dom'
import SlimLeftSidebar from '../components/SlimLeftSidebar'
import HeroSection from './HeroSection'
import { apiConnector } from '../services/apiConnector';
import { userEndpoints } from '../services/apis';
import { setAllUsers, setLoading, setUserDetails } from '../Redux/Slices/userSlice';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Spinner from '../components/Spinner';


function HomePage() {

    const dispatch = useDispatch()
    const userDetails = useSelector((state)=>state.user.userDetails)
    const allUsers = useSelector((state)=>state.user.allUsers)
    const loading = useSelector((state)=>state.user.loading)

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

    const getAllUsers = async()=>{
        try{
            if(allUsers) return;

            dispatch(setLoading(true))
            const result = await apiConnector("GET",userEndpoints.GET_ALL_USERS)
            dispatch(setAllUsers(result?.data?.allUsers))
            dispatch(setLoading(false))

        }
        catch(error){
            console.log("Error in getting all the users : ",error)
            toast.error(error?.response?.data?.message || "Error in getting all the users")
            dispatch(setLoading(false))
        }
    }
    useEffect(()=>{
        getUserDetails();
    },[])
    useEffect(()=>{
        getAllUsers()
    },[])


  return (
    <div className='bg-yellow-400 flex justify-between'>
      {loading && <Spinner/>}

      <div className='w-[4vw] bg-orange-500'>
        <SlimLeftSidebar/>
      </div>

      <div className='w-[96vw] bg-[#161717]'>
        <Outlet/>
      </div>
    </div>
  )
}

export default HomePage
