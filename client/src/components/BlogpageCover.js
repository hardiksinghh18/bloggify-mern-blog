import React from 'react'

const BlogpageCover = ({blog}) => {
  return (
    <div className="coverSection relative   flex flex-col justify-center items-center">

        <div className=' relative h-64 rounded-lg overflow-hidden '>
          <img className='rounded-lg w-screen object-center object-cover' src={`${process.env.REACT_APP_BASE_URL}/${blog?.coverImage}`} alt="" />

        </div>
        <div className=' bg-gradient-to-t from-black to-transparent opacity-90 h-64  w-full rounded-lg   absolute  '></div>

        <div className=' absolute  text-white flex justify-center items-center gap-4 bottom-8 left-8 '>
          <h1 className='font-semibold text-xl  py-2'>{blog?.title}</h1>
          <p>{blog?.auhtor?.name}</p>

          <a href={`blogs/${blog?._id}`}  className='text-white font-semibold my-4 border text-xs border-white p-2 rounded-lg w-fit '>Read now</a>

        </div>
      </div>
  )
}

export default BlogpageCover
