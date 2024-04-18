import React from 'react'
import coverImage from '../../images/coverImage.png'
import { Link } from 'react-router-dom'



const CoverSection = () => {
  return (
    <div className="coverSection relative   flex flex-col justify-center items-center">

        <div className='imagediv relative h-96  overflow-hidden  '>
          <img className=' w-screen' src={coverImage} alt="" />

        <div className='gradient bg-gradient-to-t from-black to-transparent opacity-90 h-full  w-full  absolute  top-0  '></div>
        </div>

        <div className=' absolute flex flex-col justify-center items-center '>
          <h1 className='font-bold text-xl  text-white py-2  sm:text-3xl'>Welcome to &lt;Bloggify/&gt;</h1>
          <p className='text-white text-xs '><i>write to express,not to impress</i></p>
          <div  className='text-white font-semibold my-4 border text-xs border-white p-2 rounded-lg '><Link to={'/blogs'}>Explore</Link></div>

        </div>
      </div>

  )
}

export default CoverSection
