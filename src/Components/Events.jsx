import React from 'react'
import { Link } from 'react-router-dom'
import uparrow from '../assets/Images/uparrow.png'
import event1 from '../assets/Images/event1.jpg'

const Events = () => {
  return (
    <>
        <div className=' relative h-[420px] w-full bg-gray-300'>
            <img className='w-full h-full  object-cover' src={event1} alt="eventBanner" />
        <div className='h-full w-full text-white flex justify-end pb-16 pl-[4vw] md:pl-[100px] flex-col absolute left-0 top-0 z-50 bg-[#00000075]'>
            <h6 className='text-md font-semibold'>Join us</h6>
            <h2 className='text-4xl font-semibold mb-6'>Celebrate with us</h2>

            <Link>
            <button className='text-white text-sm flex transition-transform transform active:scale-95 hover:scale-105 items-center py-3 mt-3 px-4 bg-blue-600 gap-1'>
                Join now 
                <img className='h-5' src={uparrow} alt="" />
            </button>
            </Link>
        </div>
    </div>
    </>
  )
}

export default Events