import React from 'react'
import StatusLeftSidebar from '../components/StatusLeftSidebar'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import IndividualStatusPageSkeleton from '../components/IndividualStatusPageSkeleton'

function StatusPage() {
  const statusLoading = useSelector((state)=>state.status.statusLoading)

  return (
    <div className='flex justify-between w-full text-white'>
      {statusLoading && <IndividualStatusPageSkeleton/>}

      <div className=' lg:w-[32%] w-[25rem] bg-[#161717]'>
        <StatusLeftSidebar/>
      </div>

      <div className=' lg:w-[68%] w-[40rem] bg-[#161717]'>
        <Outlet/>
      </div>
    </div>
  )
}

export default StatusPage
