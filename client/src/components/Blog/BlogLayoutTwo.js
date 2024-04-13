import React from 'react'
import { Link } from 'react-router-dom'

const BlogLayoutTwo = ({ blog }) => {
    const date = new Date(blog?.createdAt)
    const formattedDate = date.toDateString();
    // blog&&console.log(date)
    return (
        <div>
            <div className=" flex gap-4 items-center text-dark dark:text-light">
                <a
                    href={`blogs/${blog?._id}/${blog?.title}`}
                    className=" col-span-12  lg:col-span-4 h-full rounded-xl overflow-hidden"
                >
                    <img className=" aspect-square h-18 w-24 sm:h-28 sm:w-40 object-cover object-center group-hover:scale-105 transition-all ease duration-300" src={blog?.coverImage} alt="" />
                </a>

                <div className="col-span-12  lg:col-span-8 w-full  ">

                    <a href={`blogs/${blog?._id}/${blog?.title}`} className="inline-block my-1">
                        <h2 className="font-semibold capitalize  text-xs sm:text-lg">
                            <span
                                className="bg-gradient-to-r from-accent/50 dark:from-accentDark/50 to-accent/50 dark:to-accentDark/50 bg-[length:0px_6px]
                           group-hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500  "
                            >
                                {blog?.title}
                            </span>
                        </h2>
                     

                    </a>
                       <div>
                       <a href={`/profile/${blog?.author?._id}/${blog?.author?.name}`} className='text-xs font-semibold'>Author : {blog?.author?.name}</a>
                        {blog && <p className='text-xs '>{formattedDate}</p>}

                       </div>

                </div>
            </div>
        </div>
    )
}

export default BlogLayoutTwo
