import React from 'react'
import downArrow from '../assets/Images/downArrow.png'

const SubNavbar = () => {
  return (
    <div className='h-10 w-full  items-center gap-4 pl-5 border-b-[1.5px] border-gray-300 hidden md:flex'>
        <span className='group cursor-pointer'>
                <h6 className='CustomFlex w-fit gap-2 text-xs font-[500] opacity-60 group-hover:opacity-80 group-hover:scale-95 group-hover:text-red-500'>MANAGEMENT <img className='h-3 group-hover:rotate-180 transition-all' src={downArrow} alt="" /></h6>
        </span>
        <span className='group cursor-pointer'>
                <h6 className='CustomFlex w-fit gap-2 text-xs font-[500] opacity-60 group-hover:opacity-80 group-hover:scale-95 group-hover:text-red-500'>ENGINEERING <img className='h-3 group-hover:rotate-180 transition-all' src={downArrow} alt="" /></h6>
        </span>
        <span className='group cursor-pointer'>
                <h6 className='CustomFlex w-fit gap-2 text-xs font-[500] opacity-60 group-hover:opacity-80 group-hover:scale-95 group-hover:text-red-500'>MEDICAL <img className='h-3 group-hover:rotate-180 transition-all' src={downArrow} alt="" /></h6>
        </span>
        <span className='group cursor-pointer'>
                <h6 className='CustomFlex w-fit gap-2 text-xs font-[500] opacity-60 group-hover:opacity-80 group-hover:scale-95 group-hover:text-red-500'>DESIGN <img className='h-3 group-hover:rotate-180 transition-all' src={downArrow} alt="" /></h6>
        </span>
        <span className='group cursor-pointer'>
                <h6 className='CustomFlex w-fit gap-2 text-xs font-[500] opacity-60 group-hover:opacity-80 group-hover:scale-95 group-hover:text-red-500'>MEDIA <img className='h-3 group-hover:rotate-180 transition-all' src={downArrow} alt="" /></h6>
        </span>
        <span className='group cursor-pointer'>
                <h6 className='CustomFlex w-fit gap-2 text-xs font-[500] opacity-60 group-hover:opacity-80 group-hover:scale-95 group-hover:text-red-500'>TOURISM <img className='h-3 group-hover:rotate-180 transition-all' src={downArrow} alt="" /></h6>
        </span>
        <span className='group cursor-pointer'>
                <h6 className='CustomFlex w-fit gap-2 text-xs font-[500] opacity-60 group-hover:opacity-80 group-hover:scale-95 group-hover:text-red-500'>HOSPITALITY <img className='h-3 group-hover:rotate-180 transition-all' src={downArrow} alt="" /></h6>
        </span>
        <span className='group cursor-pointer'>
                <h6 className='CustomFlex w-fit gap-2 text-xs font-[500] opacity-60 group-hover:opacity-80 group-hover:scale-95 group-hover:text-red-500'>COUNSELING <img className='h-3 group-hover:rotate-180 transition-all' src={downArrow} alt="" /></h6>
        </span>
    </div>
  )
}

export default SubNavbar