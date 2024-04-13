import React from 'react'
import { Link } from 'react-router-dom'

const BlogLayoutOne = ({ blog }) => {
    return (

        <div className="group relative inline-block overflow-hidden rounded-xl">
            <div className="relative top-0 left-0 bottom-0 right-0 h-full bg-gradient-to-b from-transparent to-dark/90 rounded-xl z-10"></div>

            <a href={`blogs/${blog?._id}/${blog?.title}`} className="mt-6">
                <div className='  relative w-32 h-24 sm:w-96 sm:h-64   '>
                    <img className="w-full h-full object-center object-cover rounded-xl  group-hover:scale-105 transition-all ease duration-300" src={blog?.coverImage} alt="" />
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 rounded-xl"></div>
                </div>
            </a>

                <a href={`blogs/${blog?._id}/${blog?.title}`} className="mt-6">
            <div className="w-full absolute bottom-0  p-3 sm:p-10 z-20">
                    <h2 className="font-bold capitalize  text-[.5rem] sm:text-xl md:text-xl text-light mt-2 sm:mt-4">
                        <span className="bg-gradient-to-r from-accent to-accent bg-[length:0px_6px] dark:from-accentDark/50 dark:to-accentDark/50 group-hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 font-semibold  text-white">
                            {blog?.title}
                        </span>
                    </h2>
            </div>
                </a>
        </div>

    )
}

export default BlogLayoutOne
