import React from 'react'
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import cardPhoto from '../assets/Images/teacher.jpg'
import rupee from '../assets/Images/rupee.png'
import CustomButton from '../Ui components/CustomButton';

const PopularCourses = () => {
    const boxData = [
        {
          title: 'Complete fundamentals beginners to advanced',
          description: 'Digital Marketing Essentials teaches the basics of content, social media, SEO, and email marketing to help you grow your online presence.',
          price: '24,50,000',
          image: cardPhoto
        },
        {
          title: 'Complete fundamentals beginners to advanced',
          description: 'Digital Marketing Essentials teaches the basics of content, social media, SEO, and email marketing to help you grow your online presence.',
          price: '24,50,000',
          image: cardPhoto
        },
        {
          title: 'Complete fundamentals beginners to advanced',
          description: 'Digital Marketing Essentials teaches the basics of content, social media, SEO, and email marketing to help you grow your online presence.',
          price: '24,50,000',
          image: cardPhoto
        }
      ];
  return (
    <div className='w-full min-h-44 max-w-[1420px] pl-[10px] pr-[10px] pb-10'>
      <div className='flex items-center justify-between mb-10'>
        <h3 className='text-xl font-bold'>Popular Courses</h3>
        {/* <button className='viewmorebtn text-sm w-24 whitespace-nowrap '>
          View more
        </button> */}
        <CustomButton text='View more'/>
      </div>

      <div className="boxWrapper w-full flex flex-col flex-wrap md:flex-row items-center gap-6">
        {boxData.map((box, index) => (
          <Link to="/coursesinfopage" key={index} className="box lg:max-w-[500px] shadow-lg">
            <div className="imageContainer">
              <img className='h-full w-full object-cover' src={box.image} alt="boxphoto" />
            </div>
            <div className="textContainer">
              <Stack spacing={1}>
                <Rating name="half-rating-read" defaultValue={4.3} precision={0.5} readOnly />
              </Stack>

              <h3 className='text-xl md:text-xl lg:text-2xl font-semibold text-[#0B104A]'>
                {box.title}
              </h3>

              <p className='text-sm mt-2'>{box.description}</p>

              <h3 className='flex items-center mt-2 text-2xl font-bold text-[#000000c4]'>
                <img className='h-5 mt-1 opacity-70' src={rupee} alt="rupee" />
                {box.price}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PopularCourses