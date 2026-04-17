import React from 'react'
import defaultProfile from '../../images/defaultProfile.jpg'
import { slugify } from '../../Utils/slugify'

const BlogLayoutOne = ({ blog }) => {
    const date = new Date(blog?.createdAt);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = blog?.createdAt ? date.toLocaleDateString('en-US', options) : '';

    return (
        <div className="group flex flex-col w-[280px] sm:w-[340px] md:w-[380px] bg-white dark:bg-[#1e1e1e] rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800">
            <a href={`/blogs/${blog?._id}/${slugify(blog?.title)}`} className="relative h-[180px] sm:h-[200px] md:h-[220px] w-full overflow-hidden block">
                <img 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out" 
                    src={blog?.coverImage} 
                    alt={blog?.title} 
                />
            </a>
            
            <div className="p-5 sm:p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md text-[11px] uppercase tracking-wide">
                        Article
                    </span>
                    <span>{formattedDate}</span>
                </div>
                
                <a href={`/blogs/${blog?._id}/${slugify(blog?.title)}`} className="block mb-4">
                    <h2 className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {blog?.title}
                    </h2>
                </a>
                
                <div className="mt-auto flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <a href={`/profile/${blog?.author?._id}/${slugify(blog?.author?.name)}`}>
                        <img 
                            src={blog?.author?.profileImage || defaultProfile} 
                            alt={blog?.author?.name}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
                        />
                    </a>
                    <div className="flex flex-col">
                        <a href={`/profile/${blog?.author?._id}/${slugify(blog?.author?.name)}`} className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:underline">
                            {blog?.author?.name}
                        </a>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Author</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogLayoutOne
