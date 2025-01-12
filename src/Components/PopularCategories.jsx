import React, { useState } from 'react'
import cat1 from '../assets/Images/categories/cat1.png'
import cat2 from '../assets/Images/categories/cat2.png'
import cat3 from '../assets/Images/categories/cat3.png'
import cat4 from '../assets/Images/categories/cat4.png'
import cat5 from '../assets/Images/categories/cat5.png'
import cat6 from '../assets/Images/categories/cat6.png'
import cat7 from '../assets/Images/categories/cat7.png'
import cat8 from '../assets/Images/categories/cat8.png'
import cat9 from '../assets/Images/categories/cat9.png'
import cat10 from '../assets/Images/categories/cat10.png'
import cat11 from '../assets/Images/categories/cat11.png'
import cat12 from '../assets/Images/categories/cat12.png'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'

const categories = [
  { img: cat1, title: 'Digital Marketing' },
  { img: cat2, title: 'UI/UX Design' },
  { img: cat3, title: '3D Visual Design' },
  { img: cat4, title: 'Content Marketing' },
  { img: cat5, title: 'Photography' },
  { img: cat6, title: 'Photo Lifestyle' },
  { img: cat7, title: 'Art & Design' },
  { img: cat8, title: 'Finance & Banking' },
  { img: cat9, title: 'Graphic Design' },
  { img: cat10, title: 'Interior Design' },
  { img: cat11, title: '3D Visual Design' },
  { img: cat12, title: 'Art & Design' },
]

const PopularCategories = () => {
  const [content, setContent] = useState([]);
          const { data, isLoading, isError } = useQuery(
            ["career"],
            () => category(),
            {
              enabled: true,
              onSuccess: (data) => {
                const { result } = data.data;
                // console.log(data.data)
               setContent(result) 
              }
            }
          );
          if (isLoading) {
            return <div className="flex justify-center items-center h-screen">Loading...</div>;
          }
        
          if (isError) {
            return <div className="flex justify-center items-center h-screen">Error loading category</div>;
          }
  return (
    <div className='gradient-background flex flex-wrap flex-col items-center justify-center text-center min-h-96 w-full p-2 lg:p-8'>
      <h1 className="text-3xl lg:text-4xl flex flex-col items-center justify-center text-center text-[#0B104A] font-semibold mb-5">
        Find Out by Popular Categories
      </h1>
      <p className='text-sm md:w-[50%]'>We offer a brand new approach to the most basic learning paradigms. Choose from a wide range of learning options and gain new skills! Our school is known for its quality education.</p>

      <div className='mt-6 flex flex-wrap gap-2 lg:max-w-[1100px] justify-center'>
        {content.map((category, index) => (
          <Link key={index} className='h-12 py-2 px-2 md:px-3 md:max-w-auto flex flex-1 max-w-fit gap-1 whitespace-nowrap items-center rounded-full bg-white'>
            {/* <div className="catImg border-4 flex items-center justify-center overflow-hidden border-sky-200 rounded-full h-10 w-10">
              <img className='h-6 w-6 object-contain' src={category.img} alt={category.title} />
            </div> */}
            <h4 className='text-xs md:text-md'>{category.name}</h4>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PopularCategories
