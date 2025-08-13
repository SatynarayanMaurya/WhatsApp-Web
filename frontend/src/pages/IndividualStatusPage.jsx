import React, { use, useEffect, useRef, useState } from 'react'
import profileImage from "../assets/profile image.jpg"
import video1 from "../assets/video.mp4"
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import socket from "../Utils/socket"

function IndividualStatusPage() {
    const userDetails = useSelector((state)=>state.user.userDetails)
    const {id} = useParams();
    const allStatus = useSelector((state)=>state.status.allStatus)
    const videoRef = useRef(null);

    function formatTimestampToTime(ms) {
        if (!ms) return ""; // handle empty/null case
        const date = new Date(ms);
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    useEffect(() => {
        if ( videoRef.current) {
        const video = videoRef.current;

        video.play().catch(() => {
            video.muted = true;
            video.play();

            const unmuteHandler = () => {
            video.muted = false;
            video.play();
            window.removeEventListener("click", unmuteHandler);
            };
            window.addEventListener("click", unmuteHandler);
        });
        }
    }, []);

  const [findStatus,setFindStatus] = useState(null)
  useEffect(()=>{
      const findedStatus = allStatus?.find((status)=>status?._id === id )
    setFindStatus(findedStatus)
  },[id,allStatus])


    useEffect(()=>{
        if(!findStatus?._id) return ;
        const isAlreadySeen = findStatus?.views?.some(
            (v) => v?.viewer?._id?.toString() === userDetails?._id?.toString()
        );
        if(isAlreadySeen) return ;

        socket.emit("seenStatus",{
            statusId:findStatus?._id,
            seenBy:userDetails?._id,
            statusOwner:findStatus?.user?._id
        })
    },[findStatus?._id])


  return (
    <div className='h-screen flex flex-col gap-6'>

        <div className='flex gap-4 items-center cursor-pointer px-4 mt-2 pb-2 border-b border-[#454545]'>

            <div>
                <img src={findStatus?.user?.profileImage || `https://i.pravatar.cc/101`} alt="" className='w-12 h-12 rounded-full object-cover' />
            </div>

            <div className='flex flex-col  w-full'>
                <div className='flex justify-between items-center w-full '>
                    <p className='text-[17px]'>{findStatus?.user?.name||"No user"}</p>
                </div>
                <div className='flex justify-between items-center'>
                    <p className='text-sm text-[#a0a0a0]'>11:23 PM</p>
                </div>
            </div>
        </div>
        <div className='flex gap-6 justify-between'>
            <div className={`h-[85vh] ${findStatus?.user?._id === userDetails?._id ? "lg:w-[45vw] w-[25rem]":"w-full"}   p-4   flex justify-center items-center`}>
                {
                    findStatus?.type !== "mp4" ?
                    <img src={findStatus?.statusUrl || profileImage} alt="" className='h-full w-auto object-cover' />:
                    <video
                        ref={videoRef}
                        src={findStatus?.statusUrl}
                        autoPlay
                        loop
                        controls={false}
                        playsInline
                        className="h-full w-auto object-cover"
                    />
                }
            </div>

            {
                findStatus?.user?._id === userDetails?._id &&
                <div className=' lg:w-[20vw] w-[20rem] p-4 border-l border-[#454545]'>
                    <h1 className='text-xl font-semibold pb-2 border-b border-[#454545]'>Viewer - {findStatus?.views?.length-1}</h1>

                    <div className='flex flex-col gap-2  max-h-[75vh] overflow-scroll scrollbar-slim mt-2'>

                        {
                            findStatus?.views?.map((view)=>{
                                return view?.viewer?._id !== userDetails?._id && <div key={view?._id} className='flex gap-4 items-center cursor-pointer px-4 mt-2 '>

                                            <div>
                                                <img src={view?.viewer?.profileImage || `https://i.pravatar.cc/101`} alt="" className='w-16 h-12 rounded-full object-cover' />
                                            </div>

                                            <div className='flex flex-col  w-full'>
                                                <div className='flex justify-between items-center w-full '>
                                                    <p className='text-[17px]'>{view?.viewer?.name||"No user"}</p>
                                                </div>
                                                <div className='flex justify-between items-center'>
                                                    <p className='text-sm text-[#a0a0a0]'>{formatTimestampToTime(view?.viewedAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                            })
                        }

                    

                    </div>
                </div>
            }

         </div>


    </div>
  )
}

export default IndividualStatusPage
