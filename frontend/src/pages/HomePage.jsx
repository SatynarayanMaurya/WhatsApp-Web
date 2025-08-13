import { Outlet } from 'react-router-dom'
import SlimLeftSidebar from '../components/SlimLeftSidebar'
import { apiConnector } from '../services/apiConnector';
import { userEndpoints } from '../services/apis';
import { setAllUsers, setLoading, setUserDetails } from '../Redux/Slices/userSlice';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import IndividualStatusPageSkeleton from '../components/IndividualStatusPageSkeleton';


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
    <div className=' flex justify-between h-screen'>
      {loading && <IndividualStatusPageSkeleton/>}

      <div className='lg:w-[4vw] w-[15vw] flex-shrink-0'>
        <SlimLeftSidebar/>
      </div>

      <div className='lg:w-[96vw] w-[65rem] bg-[#161717]'>
        <Outlet/>
      </div>
    </div>
  )
}

export default HomePage
