import React from 'react'
import agricultureImg from '../assets/Images/agriculture.jpg'
import BlogCard from '../Ui components/BlogCard';
import CustomButton from '../Ui components/CustomButton';


const blogData = [
    {
      title: "Agriculture",
      description: "Agriculture offers careers in farming, agribusiness, and technology, ideal for those interested in food security and sustainability. It combines hands-on work with innovation.",
      image: agricultureImg,
      buttonText: "View more"
    },
    {
      title: "Sustainable Farming",
      description: "Sustainable farming focuses on eco-friendly practices that ensure long-term productivity without harming the environment.",
      image: agricultureImg,
      buttonText: "View more"
    },
    {
      title: "Agri-Tech Innovations",
      description: "Agri-tech uses technology to improve crop yields, automate tasks, and optimize resource use, revolutionizing traditional farming methods.",
      image: agricultureImg,
      buttonText: "View more"
    },
    {
      title: "Organic Agriculture",
      description: "Organic agriculture avoids synthetic chemicals, promoting natural growth cycles and benefiting both the soil and consumers.",
      image: agricultureImg,
      buttonText: "View more"
    }
  ];

const BlogComponent = () => {
  return (
    <>
        <div className='w-full min-h-44 max-w-[1420px] pl-[10px]  pr-[10px] pb-10'>
            <div className='flex items-center justify-between mb-10'>
                <h3 className='text-xl font-bold'>Blogs</h3>
                {/* <button className='viewmorebtn text-sm w-24 whitespace-nowrap '>
                View more
                </button> */}
                <CustomButton text='View more'/>
            </div>

            <div className="blogCont flex flex-wrap gap-3 justify-between">

                {blogData.map((blog, index) =>(
                       <BlogCard
                       key={index}
                       image={blog.image}
                       title={blog.title}
                       description={blog.description}
                       buttonText={blog.buttonText}
                       />
                ))}
                
            </div>
        </div>
    </>
  )
}

export default BlogComponent