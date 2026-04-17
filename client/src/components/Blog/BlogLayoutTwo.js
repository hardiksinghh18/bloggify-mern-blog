import React from 'react'
import defaultProfile from '../../images/defaultProfile.jpg'
import { slugify } from '../../Utils/slugify'

const BlogLayoutTwo = ({ blog }) => {
    const date = new Date(blog?.createdAt)
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = blog?.createdAt ? date.toLocaleDateString('en-US', options) : '';
    const profileImageUrl = blog?.author?.profileImage || defaultProfile;

    return (
        <a href={`/blogs/${blog?._id}/${slugify(blog?.title)}`} className="group flex gap-5 items-start p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200">
            <div className="shrink-0 w-[120px] h-[90px] sm:w-[140px] sm:h-[100px] rounded-xl overflow-hidden">
                <img
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    src={blog?.coverImage}
                    alt={blog?.title}
                />
            </div>

            <div className="flex flex-col justify-between flex-1 min-h-[90px] sm:min-h-[100px]">
                <h2 className="font-bold text-sm sm:text-[17px] leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {blog?.title}
                </h2>

                <div className="flex items-center gap-2 mt-2">
                    <img src={profileImageUrl} alt={blog?.author?.name} className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-xs font-medium opacity-70">{blog?.author?.name}</span>
                    <span className="text-xs opacity-50">·</span>
                    <span className="text-xs opacity-50">{formattedDate}</span>
                </div>
            </div>
        </a>
    )
}

export default BlogLayoutTwo
