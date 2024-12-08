import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
// import { Toast } from 'react-toastify/dist/components'
import { toast } from 'react-toastify'


const BlogLayoutfour = (props) => {
    const { blog, userInfo, userId } = props

    const date = new Date(blog?.createdAt)
    const formattedDate = date.toDateString();


    const deleteBlog = (blogId) => {
        const confirm = window.confirm('Delete this Blog permanently ?')
        if (confirm) {

            const res = axios.post(`${process.env.REACT_APP_BASE_URL}/deleteblog`, { blogId })
            toast.success('Blog deleted successfully')
        }
        setTimeout(() => {
            window.location.reload();
        }, 3000);


    }

    

    return (
        <>
            <div className=" flex gap-4 items-center  shadow-md p-4  overflow-hidden text-dark dark:text-light justify-between w-[90vw] lg:w-[60vw] ">
                <a
                    href={`/blogs/${blog?._id}/${blog?.title}`}
                    className=" col-span-12  lg:col-span-4 h-full rounded-xl overflow-hidden"
                >

                    <img className=" aspect-square h-10 w-16 sm:h-16 sm:w-20 object-cover object-center group-hover:scale-105 transition-all ease duration-300" src={blog?.coverImage} alt="" />


                </a>

                <div className="col-span-12  lg:col-span-8 w-full">

                    <a href={`/blogs/${blog?._id}/${blog?.title}`} className="inline-block my-1">
                        <h2 className="font-semibold capitalize text-[0.65rem] sm:text-lg">
                            <span
                                className="bg-gradient-to-r from-accent/50 dark:from-accentDark/50 to-accent/50 dark:to-accentDark/50 bg-[length:0px_6px]
                group-hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 "
                            >
                                {blog?.title}
                            </span>
                        </h2>
                      <div className='hidden sm:flex flex-col'>
                      <p className='text-[0.65rem] sm:text-xs'>Author : {blog?.author?.name}</p>
                        {blog && <p className='text-[0.65rem] sm:text-xs'>{formattedDate}</p>}

                      </div>

                    </a>

                </div>


                {(userInfo?._id === userId?.id)?(
                <div className='h-full flex  items-start'>
                    <button onClick={() => deleteBlog(blog?._id)}> <i className='bx bxs-trash-alt'></i></button>
                </div>
                   ):('')}

            </div>



        </>
    )
}

export default BlogLayoutfour