import React from 'react'
import CustomButton from './CustomButton'

const BlogCard = ({ image, title, description, buttonText }) => {
  return (
    <div className="blogcard flex-1 h-[340px] min-w-56 max-w-74 sm:max-w-64 shadow-md border-[2px] border-gray-800 text-center border-opacity-25 rounded-xl overflow-hidden">
      <div className="blogImg h-[170px] w-full bg-gray-200 rounded-xl overflow-hidden">
        <img className='h-full w-full object-cover' src={image} alt={title} />
      </div>
      <div className="blogtext flex flex-col items-center justify-between p-2 h-[170px]">
        <div>
          <h3 className='text-xl font-semibold'>{title}</h3>
          <p className='text-xs mt-2' dangerouslySetInnerHTML={{ __html: description }} />
        </div>
        <CustomButton text={buttonText} className='!h-8 !max-w-28' to='/blogpage' />
      </div>
    </div>
  )
}

export default BlogCard
