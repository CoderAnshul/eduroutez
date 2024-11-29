import React from 'react'
import pageBanner from '../assets/Images/pageBanner.png'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Typography } from '@mui/material';


function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }

const PageBanner = ({pageName, currectPage}) => {
  return (
    <div className='h-44 md:h-64 lg:h-80 w-full  relative flex justify-center items-center flex-col'>
        <img src={pageBanner} className='absolute h-full w-full object-cover z-0 ' alt="pagebanner" />
        <h3 className='relative text-4xl font-semibold z-10'>{pageName}</h3>
        <div role="presentation" onClick={handleClick}>
      <Breadcrumbs className='relative z-10' aria-label="breadcrumb">
        <Link className='font-semibold' underline="hover" color="inherit" href="/" >
          Home
        </Link>
        
        <Typography sx={{ color: 'text.primary' }}>{currectPage}</Typography>
      </Breadcrumbs>
    </div>
    </div>
  )
}

export default PageBanner