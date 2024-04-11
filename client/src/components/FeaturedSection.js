import React from 'react'
import BlogLayoutOne from './Blog/BlogLayoutOne'
import BlogLayoutTwo from './Blog/BlogLayoutTwo'
const FeaturedSection = ({ blogsData }) => {
    return (
        <div>
            <section className="w-full  mt-8 sm:mt-16  md:mt-16 px-5 sm:px-10 md:px-24  sxl:px-32 flex flex-col items-center justify-center ">
              <div className='flex justify-between w-full'>
                <h2 className=" inline-block font-bold capitalize text-xl  text-dark dark:text-light sm:text-3xl">Featured Posts</h2>
                <a href="/blogs" className=' text-[1rem] font-semibold py-1  border-b-2 border-black '>All Blogs</a>
              </div>
                <div className="flex  justify-start items-center gap-12  mt-4 sm:mt-8 ">
                    <div className=' hidden lg:flex'>
                        <article className=" col-span-2  sxl:col-span-1 row-span-2 relative">
                            <BlogLayoutOne blog={blogsData[0]} />
                        </article>
                    </div>
                    <div className='flex flex-col gap-4'>
                        <article className=" col-span-2 sm:col-span-1 row-span-1 relative">
                            <BlogLayoutTwo blog={blogsData[1]} />

                        </article>
                        <article className="col-span-2 sm:col-span-1 row-span-1 relative">
                            <BlogLayoutTwo blog={blogsData[2]} />

                        </article>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default FeaturedSection
