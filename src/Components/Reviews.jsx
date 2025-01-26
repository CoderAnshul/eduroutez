import React from 'react'
import CustomButton from '../Ui components/CustomButton'
import ReviewBox from '../Ui components/ReviewBox';
import { useQuery } from 'react-query';
import { getReviews } from '../ApiFunctions/api';
// import { useMutation, useQuery } from '@tanstack/react-query';

const reviews = [
    {
      id: 1,
      name: 'Ajmain Adil',
      company: 'Groton Inc',
      text: 'ABC University has a beautiful campus, great professors, and a strong community. The extracurriculars are diverse, and career services are helpful. Tuition is high, but it\'s a solid place for a well-rounded college experience.',
      userImage: 'https://dummyimage.com/150x150/cccccc/000000',
      rating:4.6
    },
    {
      id: 2,
      name: 'Sarah Lee',
      company: 'Tech Solutions',
      text: 'The campus is lovely, and the professors are very supportive. The university offers numerous resources for career development, and there are always activities to get involved in.',
      userImage: 'https://dummyimage.com/150x150/cccccc/000000',
      rating:5
    },
    {
      id: 3,
      name: 'John Doe',
      company: 'InnovateX',
      text: 'The campus is vibrant, with state-of-the-art facilities that make learning engaging and enjoyable. The professors are not only highly experienced in their fields but are also approachable and genuinely invested in students success. The courses are well-structured, challenging, and designed to prepare students for real-world scenarios. Additionally, there is a strong sense of community among students, faculty, and staff, creating an environment where everyone feels supported and valued.',
      userImage: 'https://dummyimage.com/150x150/cccccc/000000',
      rating:4.5
    },
    {
      id: 4,
      name: 'John Doe',
      company: 'Innovate',
      text: 'I had an amazing time at ABC University. The professors are highly experienced, and there is a great sense of community. The only downside is the high cost of tuition.',
      userImage: 'https://dummyimage.com/150x150/cccccc/000000',
      rating:5
    },
  ];

  

export const Reviews = () => {

  const { data, isLoading, isError, error  } = useQuery(
    ["reviews"],
    () => getReviews(),
    {
      enabled:true,
    }
  );
  console.log(data);

console.log(data);
  return (
    <>
        <div className='reviews w-full min-h-44 p-[4vw] pl-[10px]  pr-[10px] pb-10'>
            <div className=' w-full mx-auto min-h-44 max-w-[1420px] pl-[10px]  pr-[10px] pb-10'>
                <div className='flex items-center justify-between mb-10'>
                    <h3 className='text-xl font-bold'>Reviews</h3>
                    
                </div>

                <div className="flex gap-3 flex-wrap justify-between">
                {reviews.map((review) => (
                        <ReviewBox key={review.id} review={review}/>
                    ))}
                </div>
            </div>
        </div>
    </>
  )
}
