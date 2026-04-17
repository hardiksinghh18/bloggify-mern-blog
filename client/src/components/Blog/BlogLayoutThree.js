import React from 'react'
import { Tooltip } from '@mui/material'
import defaultProfile from '../../images/defaultProfile.jpg'
import { useGetCommentsQuery } from '../../features/comments/commentsApiSlice'
import useShareBlog from '../../hooks/useShareBlog'
import { slugify } from '../../Utils/slugify'

const BlogLayoutThree = ({ blog }) => {
    const authorName = blog?.author?.name || 'Anonymous';
    const isLongName = authorName.length > 20;

    const date = new Date(blog?.createdAt);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    const profileImageUrl = blog?.author?.profileImage || defaultProfile;

    const { data: allComments = [] } = useGetCommentsQuery();
    const blogCommentsCount = allComments?.filter((item) => item.blogId === blog?._id)?.length || 0;

    // Calculate Estimated Read Time (assuming 200 words per minute average reading speed)
    const textContent = blog?.content ? blog.content.replace(/<[^>]*>?/gm, '') : '';
    const wordCount = textContent.trim().split(/\s+/).length;
    const readTimeMinutes = Math.ceil(wordCount / 200);

    const shareBlog = useShareBlog();

    return (
        <div className="w-full flex flex-col-reverse sm:flex-row justify-between items-start gap-6 py-8 border-b border-gray-200 dark:border-gray-800 transition-colors sm:container sm:mx-auto overflow-hidden">
            <div className="flex-1 flex flex-col justify-between w-full h-full min-w-0">
                {/* Author Info */}
                <div className="flex items-center gap-2 mb-3">
                    <img src={profileImageUrl} alt="author" className="w-6 h-6 rounded-full object-cover" />
                    <Tooltip 
                        title={isLongName ? authorName : ""} 
                        arrow 
                        placement="top"
                        slotProps={{
                            tooltip: {
                                sx: {
                                    bgcolor: 'rgba(28, 28, 30, 0.95)',
                                    color: '#fff',
                                    padding: '8px 12px',
                                    fontSize: '12px',
                                    maxWidth: 300,
                                    maxHeight: 200,
                                    overflowY: 'auto',
                                    wordBreak: 'break-all',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
                                    '& .MuiTooltip-arrow': {
                                        color: 'rgba(28, 28, 30, 0.95)',
                                    },
                                }
                            }
                        }}
                    >
                        <p className="text-sm font-medium opacity-80 max-w-[150px] sm:max-w-[200px] truncate">
                            <a href={`/profile/${blog?.author?._id}/${slugify(blog?.author?.name)}`} className="font-medium hover:underline">
                                {authorName}
                            </a>
                        </p>
                    </Tooltip>
                </div>

                {/* Title & Summary */}
                <a href={`/blogs/${blog?._id}/${slugify(blog?.title)}`} className="group block">
                    <h2 className="text-2xl sm:text-[28px] font-extrabold leading-tight mb-2">
                        {blog?.title}
                    </h2>
                    <p className="text-base sm:text-[17px] mb-4 overflow-hidden text-ellipsis line-clamp-2 opacity-80 break-all" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {blog?.summary}
                    </p>
                </a>

                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 mt-auto w-full pt-2">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm font-medium opacity-80">
                        <span className="whitespace-nowrap">{formattedDate}</span>
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="flex items-center gap-1.5">
                                <i className='bx bx-show text-[17px]'></i>
                                <span>{blog?.views || 0}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <i className='bx bx-like text-[17px]'></i>
                                <span>{blog?.likes?.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <i className='bx bx-message-rounded text-[17px]'></i>
                                <span>{blogCommentsCount}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={(e) => shareBlog(blog, e)}
                                    className="flex items-center hover:text-blue-500 transition-colors p-1 -m-1"
                                    title="Share this post"
                                >
                                    <i className='bx bx-share-alt text-[17px]'></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Read Time */}
                    <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        <span>{readTimeMinutes} min read</span>
                    </div>
                </div>
            </div>

            {/* Thumbnail */}
            <a href={`/blogs/${blog?._id}/${slugify(blog?.title)}`} className="shrink-0 w-full sm:w-[240px] md:w-[280px] h-[160px] cursor-pointer">
                <img src={blog?.coverImage} alt={blog?.title} className="w-full h-full object-cover sm:rounded-md rounded-none hover:opacity-90 transition-opacity" />
            </a>
        </div>
    )
}

export default BlogLayoutThree
