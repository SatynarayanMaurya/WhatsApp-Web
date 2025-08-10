import React from 'react'
import profileImage from "../assets/profile image.jpg"
import { IoCallOutline } from "react-icons/io5";
function ChatHeader({findUser}) {

  function splitDateTime(isoString) {
    if(!isoString) return
    const dateObj = new Date(isoString);

    const date = dateObj.toISOString().split("T")[0];

    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // convert 0 -> 12
    const time = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;

    return { date, time };
  }


  return (
      <div className='bg-black py-3 px-6 flex justify-between items-center'>
        <div className='flex gap-4 items-center'>
            <div>
                <img src={findUser?.profileImage || `https://i.pravatar.cc/100`} alt="" className='w-10 h-10 rounded-full object-cover' />
            </div>
            <div>
              <p className='font-semibold text-[17px]'>{findUser?.name}</p>
              {
                findUser?.isOnline === true ?
                <p className='text-green-500 font-light text-sm'>Online</p>:
                <p className='font-light text-sm'>Last seen at {splitDateTime(findUser?.lastSeen)?.time} </p>
              }
            </div>
        </div>

        <div className='flex gap-4 items-center'>
          <div className='p-2 rounded-full hover:bg-[#262524] cursor-pointer transition-all duration-200'>
            <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="" fill="none"><title>video-call-refreshed</title><path d="M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H16C16.55 4 17.0208 4.19583 17.4125 4.5875C17.8042 4.97917 18 5.45 18 6V10.5L21.15 7.35C21.3167 7.18333 21.5 7.14167 21.7 7.225C21.9 7.30833 22 7.46667 22 7.7V16.3C22 16.5333 21.9 16.6917 21.7 16.775C21.5 16.8583 21.3167 16.8167 21.15 16.65L18 13.5V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H4ZM4 18H16V6H4V18Z" fill="currentColor"></path></svg>
          </div>

          <div className='p-2 rounded-full hover:bg-[#262524] cursor-pointer transition-all duration-200'>
            <p className='text-xl'><IoCallOutline/></p>
          </div>

          <div className='p-2 rounded-full hover:bg-[#262524] cursor-pointer transition-all duration-200'>
            <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="" fill="none"><title>more-refreshed</title><path d="M12 20C11.45 20 10.9792 19.8042 10.5875 19.4125C10.1958 19.0208 10 18.55 10 18C10 17.45 10.1958 16.9792 10.5875 16.5875C10.9792 16.1958 11.45 16 12 16C12.55 16 13.0208 16.1958 13.4125 16.5875C13.8042 16.9792 14 17.45 14 18C14 18.55 13.8042 19.0208 13.4125 19.4125C13.0208 19.8042 12.55 20 12 20ZM12 14C11.45 14 10.9792 13.8042 10.5875 13.4125C10.1958 13.0208 10 12.55 10 12C10 11.45 10.1958 10.9792 10.5875 10.5875C10.9792 10.1958 11.45 10 12 10C12.55 10 13.0208 10.1958 13.4125 10.5875C13.8042 10.9792 14 11.45 14 12C14 12.55 13.8042 13.0208 13.4125 13.4125C13.0208 13.8042 12.55 14 12 14ZM12 8C11.45 8 10.9792 7.80417 10.5875 7.4125C10.1958 7.02083 10 6.55 10 6C10 5.45 10.1958 4.97917 10.5875 4.5875C10.9792 4.19583 11.45 4 12 4C12.55 4 13.0208 4.19583 13.4125 4.5875C13.8042 4.97917 14 5.45 14 6C14 6.55 13.8042 7.02083 13.4125 7.4125C13.0208 7.80417 12.55 8 12 8Z" fill="currentColor"></path></svg>
          </div>
        </div>
      </div>
  )
}

export default ChatHeader
