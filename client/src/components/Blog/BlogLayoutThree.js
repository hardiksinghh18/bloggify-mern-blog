import React from 'react'

const BlogLayoutThree = ({ blog }) => {
    const date = new Date(blog?.createdAt)
    const formattedDate = date.toDateString();
    return (

       
        <div className="recommendedCard w-80 m-4 px-2 flex flex-col gap-2 justify-center items-center min-h-80  shadow-lg rounded-2xl">
 
            <a href={`blogs/${blog?._id}/${blog?.title}`}>
            <div className=' flex items-center justify-center w-72 h-48 relative'  >
                <img className="w-full h-full object-center object-cover rounded-lg group-hover:scale-105 transition-all ease duration-300" src={blog?.coverImage} alt="" />
            </div>
                </a>
            <div className='justify-start w-full px-2 py-1'>
                <a href={`blogs/${blog._id}/${blog?.title}`} className='flex justify-between w-full '>
                    <h3 className='font-semibold w-full  '>{blog?.title?.length > 50 ? `${blog?.title?.slice(0, 50)}...` : `${blog?.title}`}</h3>

                </a>
                {/* <p className='w-full text-sm'>{blog?.summary?.length > 30 ? `${blog?.summary?.slice(0, 30)}...` : `${blog?.summary}`}</p> */}
            </div>

            <div className='flex w-full px-2 pb-4 justify-between  items-end ju'>
                <div className='flex flex-col '>
                    <a href={`/profile/${blog?.author?._id}/${blog?.author?.name}`}>
                    <i className='text-xs  '>Author : <span className='font-semibold'>{blog?.author?.name}</span></i>

                    </a>
                    <p className='text-xs'>{formattedDate} </p>
                </div>
                <a className='text-sm  hover:border-b-2' href={`blogs/${blog?._id}/${blog?.title}`}> Read More</a>
            </div>

        </div>
        
    )
}

export default BlogLayoutThree
