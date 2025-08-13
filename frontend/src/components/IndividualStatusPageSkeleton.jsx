import React from 'react'

function IndividualStatusPageSkeleton() {
  return (
    <div className='flex h-screen  fixed inset-0 left-16 bg-black z-10'>
        <div className=' flex flex-col gap-6 animate-pulse  lg:w-[32%] w-[25rem]'>
            <div className='flex gap-4 items-center px-4 mt-2 pb-2 border-b border-[#454545]'>
                <div>
                    <div className='w-12 h-12 rounded-full bg-gray-200 object-cover' ></div>
                </div>
                <div className='flex flex-col  w-full'>
                    <div className='flex justify-between items-center w-full '>
                        <div className='h-4 bg-gray-200 w-1/2'></div>
                    </div>
                    <div className='flex justify-between items-center'>
                        <div className='h-4 bg-gray-200 w-1/2'></div>
                    </div>
                </div>
            </div>
            <div className='flex gap-6 flex-col justify-between h-[85vh] w-full'>
                <div className=' flex gap-6 justify-center items-center'>
                    <div className='h-[8vh] rounded-full bg-gray-200 w-[12%]'></div>
                    <div className='h-[8vh] rounded-lg bg-gray-200 w-[70%]'></div>
                </div>
                <div className=' flex gap-6 justify-center items-center'>
                    <div className='h-[8vh] rounded-full bg-gray-200 w-[12%]'></div>
                    <div className='h-[8vh] rounded-lg bg-gray-200 w-[70%]'></div>
                </div>
                <div className=' flex gap-6 justify-center items-center'>
                    <div className='h-[8vh] rounded-full bg-gray-200 w-[12%]'></div>
                    <div className='h-[8vh] rounded-lg bg-gray-200 w-[70%]'></div>
                </div>
                <div className=' flex gap-6 justify-center items-center'>
                    <div className='h-[8vh] rounded-full bg-gray-200 w-[12%]'></div>
                    <div className='h-[8vh] rounded-lg bg-gray-200 w-[70%]'></div>
                </div>
                <div className=' flex gap-6 justify-center items-center'>
                    <div className='h-[8vh] rounded-full bg-gray-200 w-[12%]'></div>
                    <div className='h-[8vh] rounded-lg bg-gray-200 w-[70%]'></div>
                </div>
                <div className=' flex gap-6 justify-center items-center'>
                    <div className='h-[8vh] rounded-full bg-gray-200 w-[12%]'></div>
                    <div className='h-[8vh] rounded-lg bg-gray-200 w-[70%]'></div>
                </div>
                <div className=' flex gap-6 justify-center items-center'>
                    <div className='h-[8vh] rounded-full bg-gray-200 w-[12%]'></div>
                    <div className='h-[8vh] rounded-lg bg-gray-200 w-[70%]'></div>
                </div>
            </div>
        </div>
        
        <div className=' flex flex-col gap-6 animate-pulse  lg:w-[68%] w-[35rem]'>
            <div className='flex gap-4 items-center px-4 mt-2 pb-2 border-b border-[#454545]'>
                <div>
                    <div className='w-12 h-12 rounded-full bg-gray-200 object-cover' ></div>
                </div>
                <div className='flex flex-col  w-full'>
                    <div className='flex justify-between items-center w-full '>
                        <div className='h-4 bg-gray-200 w-1/2'></div>
                    </div>
                    <div className='flex justify-between items-center'>
                        <div className='h-4 bg-gray-200 w-1/2'></div>
                    </div>
                </div>
            </div>
            <div className='flex justify-between'>

            <div className='flex gap-6 justify-between'>
                <div className='h-[85vh] w-full flex justify-center items-center '>
                    <div className='h-[85vh] bg-gray-200 lg:w-[30vw] w-[15rem] ml-20'></div>
                </div>
            </div>
            <div className='flex gap-6 justify-between'>
                <div className='h-[85vh] lg:w-[20vw] w-[10rem] flex justify-center items-center'>
                    <div className='h-[85vh] bg-gray-200 w-full mr-4 '></div>
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default IndividualStatusPageSkeleton
