import React from 'react'
import { Link } from 'react-router-dom'
import uparrow from '../assets/Images/uparrow.png'
import banner from '../assets/Images/counsellingbanner.png'

const ConsellingBanner = () => {
  return (
    <>
        <div className=' relative h-[420px] w-full bg-gray-300 my-8 '>
            <img className='w-full h-full  object-cover' src={banner} alt="counsellingbanner" />
        <div className='h-full w-full text-white flex justify-end pb-16 pl-[4vw] md:pl-[100px] flex-col absolute left-0 top-0 z-50 bg-[#00000075]'>
            
            <h2 className='text-[40px] font-semibold mb-6 text-red-500'>Still confused<h3 className='text-3xl text-white'>with career planning?</h3></h2>

            <Link to='/counselingpage'>
            <button className='text-white text-sm flex transition-transform transform active:scale-95 hover:scale-105 items-center py-3 mt-3 px-4 bg-blue-600 gap-1'>
                Book Conselling
                <img className='h-5' src={uparrow} alt="" />
            </button>
            </Link>
        </div>
    </div>
    </>
  )
}

export default ConsellingBanner