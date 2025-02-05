import React from 'react'
import { Link } from 'react-router-dom'
import uparrow from '../assets/Images/uparrow.png'

const Instructor = () => {
  return (
    <div className='instructor relative h-[420px] w-full bg-gray-300'>
        <div className='h-full w-full text-white flex justify-center pl-[4vw]  md:pl-[100px] flex-col absolute left-0 top-0 z-50 bg-[#00000075]'>
            <h6 className='text-md font-semibold'>Build Your Career</h6>
            <h2 className='text-4xl font-semibold mb-6'>Become a Career Counselor – Start Earning with Us!
            </h2>

            <p>counselor! Guide students to the right path and earn while helping them shape their future. Join us today!
            </p>
            <Link to="/become-couseller">
            <button className='text-white text-sm flex items-center py-3 mt-8 px-4 bg-blue-600 gap-1'>
                Apply now 
                <img className='h-5' src={uparrow} alt="" />
            </button>
            </Link>
        </div>
    </div>
  )
}

export default Instructor