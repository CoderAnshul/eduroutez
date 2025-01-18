import React, { useState } from 'react'
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import cardPhoto from '../assets/Images/teacher.jpg'
import rupee from '../assets/Images/rupee.png'
import CustomButton from '../Ui components/CustomButton';
import { getInstituteById, trendingInstitute } from '../ApiFunctions/api';
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query';

const TrendingInstitute = () => {
  const [content, setContent] = useState([]);
      const { data, isLoading, isError } = useQuery(
        ["institutes"],
        () => trendingInstitute(),
        {
          enabled: true,
          onSuccess: (data) => {
            // const { result } = data.data;
            // console.log(data.data)
           setContent(data.data) 
          }
        }
      );
      if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
      }
    
      if (isError) {
        return <div className="flex justify-center items-center h-screen">Error loading best rated</div>;
      }
      if (content.length == 0) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
      }

// console.log(content)

  // const boxData = [
  //   {
  //     id:1,
  //     title: 'Complete fundamentals beginners to advanced',
  //     description: 'Digital Marketing Essentials teaches the basics of content, social media, SEO, and email marketing to help you grow your online presence.',
  //     price: '24,50,000',
  //     image: cardPhoto
  //   },
  //   {
  //     id:2,
  //     title: 'Complete fundamentals beginners to advanced',
  //     description: 'Digital Marketing Essentials teaches the basics of content, social media, SEO, and email marketing to help you grow your online presence.',
  //     price: '24,50,000',
  //     image: cardPhoto
  //   },
  //   {
  //     id:3,
  //     title: 'Complete fundamentals beginners to advanced',
  //     description: 'Digital Marketing Essentials teaches the basics of content, social media, SEO, and email marketing to help you grow your online presence.',
  //     price: '24,50,000',
  //     image: cardPhoto
  //   }
  // ];

  return (
    <div className='w-full min-h-44 max-w-[1420px] pl-[10px] pr-[10px] pb-10 mx-auto'>
      <div className='flex items-center justify-between mb-10'>
        <h3 className='text-xl font-bold'>Trending institute</h3>
        {/* <button className='viewmorebtn text-sm w-24 whitespace-nowrap '>
          View more
        </button> */}
 <Link to="/trending-institute">
          <button className='bg-red-500 text-white py-2 px-4 rounded'>
            View more
          </button>
        </Link>        </div>

      <div className="boxWrapper w-full flex flex-col flex-wrap md:flex-row items-center gap-6">
        {content.map((institute, index) => {
          if(index<3){
            return <Link to={`/institute/${institute._id}`} key={institute._id || index} className="box lg:max-w-[500px] shadow-lg">
            <div className="imageContainer">
              <img className='h-full w-full object-cover' 
              src={institute.thumbnailImage? `http://localhost:4001/api/uploads/${institute.thumbnailImage}` : cardPhoto}
              alt="boxphoto" />
            </div>
            <div className="textContainer">
              {/* <Stack spacing={1}>
                <Rating name="half-rating-read" defaultValue={4.3} precision={0.5} readOnly />
              </Stack> */}

              <h3 className='text-xl md:text-xl lg:text-2xl font-semibold text-[#0B104A]'>
                {institute.instituteName}
              </h3>

              <p className='text-sm mt-2'>{institute.about}</p>

              <h3 className='flex items-center mt-2 text-2xl font-bold text-[#000000c4]'>
                <img className='h-5 mt-1 opacity-70' src={rupee} alt="rupee" />
                {/* {institute.price} */}
                24,50,000
              </h3>
            </div>
          </Link>
          }
         
})}
      </div>
    </div>
  );
};

export default TrendingInstitute;
