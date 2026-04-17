import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import defaultProfile from '../images/defaultProfile.jpg'
import 'react-quill/dist/quill.snow.css';
import { useSelector } from 'react-redux'
import { selectUserInfo, selectIsAuthenticated } from '../features/auth/authSlice'
import {
  useGetSingleBlogQuery,
  useIncrementViewsMutation,
  useLikeBlogMutation,
  useDislikeBlogMutation
} from '../features/blogs/blogsApiSlice'
import { useGetCommentsQuery } from '../features/comments/commentsApiSlice'
import CommentSection from '../components/CommentSection'
import EditBlog from '../components/EditBlog'
import BlogLoadingSkeleton from '../components/LoadingSkeletons/BlogLoadingSkeleton'
import useShareBlog from '../hooks/useShareBlog'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { Link } from 'react-router-dom'
import { slugify } from '../Utils/slugify'
import { useFollowUserMutation } from '../features/user/userApiSlice'
import { toast } from 'react-toastify'
import { Tooltip } from '@mui/material'

const SingleBlog = () => {
  const userInfo = useSelector(selectUserInfo);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { id } = useParams();
  const [editable, setEditable] = useState(false);

  const { data: blogData, isLoading } = useGetSingleBlogQuery(id);
  const { data: allComments = [] } = useGetCommentsQuery();
  const [incrementViews] = useIncrementViewsMutation();
  const [likeBlogApi] = useLikeBlogMutation();
  const [dislikeBlogApi] = useDislikeBlogMutation();
  const [followUser, { isLoading: followLoading }] = useFollowUserMutation();
  const shareBlog = useShareBlog();

  const handleEdit = () => {
    setEditable(!editable);
  };

  const hasIncrementedViews = useRef(false);

  useEffect(() => {
    if (id && !hasIncrementedViews.current) {
      hasIncrementedViews.current = true;
      incrementViews({ id });
    }
  }, [id, incrementViews]);

  const blog = blogData?.blog;
  const moreBlogs = blogData?.moreFromAuthor || [];
  const blogComments = allComments?.filter((item) => item.blogId === id) || [];

  // Show loading skeleton while loading
  if (isLoading || !blog) {
    return <BlogLoadingSkeleton />;
  }
  const profileImageUrl = blog?.author?.profileImage || defaultProfile;
  const formattedDate = blog?.createdAt
    ? new Date(blog?.createdAt).toDateString()
    : '';

  const handleLike = async () => {
    if (!isAuthenticated) return;
    try {
      await likeBlogApi({ blogId: blog._id }).unwrap();
    } catch (error) {
      console.error('Failed to like blog:', error);
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) return;
    try {
      await dislikeBlogApi({ blogId: blog._id }).unwrap();
    } catch (error) {
      console.error('Failed to dislike blog:', error);
    }
  };

  const hasLiked = blog?.likes?.includes(userInfo?._id);
  const hasDisliked = blog?.dislikes?.includes(userInfo?._id);

  const handleFollow = async () => {
    try {
      const res = await followUser({ targetUserId: blog?.author?._id }).unwrap();
      toast.success(res?.message);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update follow status');
    }
  };

  const isFollowingAuthor = userInfo?.following?.some(
    f => f?._id === blog?.author?._id || f === blog?.author?._id
  );

  return (
    <div >
      {!editable ? (
        <div>
          <div className=' px-4 lg:px-64 py-4 lg:py-8 flex flex-col items-center justify-center w-full'>
            <div className="w-full text-left"><h2 className=' lg:my-4 text-2xl md:text-3xl lg:text-4xl font-bold'>{blog?.title}</h2></div>
            <div className='flex flex-row flex-wrap gap-4 justify-between w-full items-center my-6'>
              <div className='flex justify-start gap-3 sm:gap-4 items-center overflow-hidden'>
                <a href={`/profile/${blog?.author?._id}/${slugify(blog?.author?.name)}`} className="shrink-0 flex items-center">
                  <img className='h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover' src={profileImageUrl} alt="" />
                </a>
                <div className='min-w-0'>
                  <Tooltip 
                    title={blog?.author?.name?.length > 20 ? blog?.author?.name : ""} 
                    arrow 
                    placement="top"
                    slotProps={{
                      tooltip: {
                        sx: {
                          bgcolor: 'rgba(28, 28, 30, 0.95)',
                          color: '#fff',
                          padding: '8px 12px',
                          fontSize: '11px',
                          maxWidth: 250,
                          maxHeight: 150,
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
                    <a href={`/profile/${blog?.author?._id}/${slugify(blog?.author?.name)}`} className="font-semibold text-[13px] sm:text-base block truncate max-w-[120px] sm:max-w-[200px]" >{blog?.author?.name}</a>
                  </Tooltip>
                  {formattedDate && <p className=" text-[11px] sm:text-sm truncate">{formattedDate}</p>}
                </div>
              </div>

              <div className='flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-6 shrink-0 mt-3 sm:mt-0 text-gray-700 dark:text-gray-300'>
                <div className='flex flex-row items-center justify-center gap-1 sm:gap-1.5'>
                  <VisibilityOutlinedIcon fontSize="small" />
                  <span className='text-[12px] sm:text-sm font-medium leading-none'>{blog?.views}</span>
                </div>
                <div
                  className={`flex flex-row items-center justify-center gap-1 sm:gap-1.5 transition-colors ${isAuthenticated ? 'cursor-pointer hover:text-blue-500' : 'opacity-60'}`}
                  onClick={handleLike}
                  title={isAuthenticated ? '' : 'Sign in to like'}
                >
                  {hasLiked ? <ThumbUpIcon fontSize="small" className="text-blue-500" /> : <ThumbUpOutlinedIcon fontSize="small" />}
                  <span className='text-[12px] sm:text-sm font-medium leading-none'>{blog?.likes?.length || 0}</span>
                </div>
                <div
                  className={`flex flex-row items-center justify-center gap-1 sm:gap-1.5 transition-colors ${isAuthenticated ? 'cursor-pointer hover:text-red-500' : 'opacity-60'}`}
                  onClick={handleDislike}
                  title={isAuthenticated ? '' : 'Sign in to dislike'}
                >
                  {hasDisliked ? <ThumbDownIcon fontSize="small" className="text-red-500" /> : <ThumbDownOutlinedIcon fontSize="small" />}
                  <span className='text-[12px] sm:text-sm font-medium leading-none'>{blog?.dislikes?.length || 0}</span>
                </div>
                <div className='flex flex-row items-center justify-center gap-1 sm:gap-1.5 hover:text-gray-500 transition-colors cursor-pointer'>
                  <a href='#comments' className='flex flex-row items-center justify-center gap-1 sm:gap-1.5'>
                    <ChatBubbleOutlineIcon fontSize="small" />
                    <span className='text-[12px] sm:text-sm font-medium leading-none'>{blogComments.length}</span>
                  </a>
                </div>
                <div
                  className='flex flex-row items-center justify-center gap-1 sm:gap-1.5 hover:text-green-500 transition-colors cursor-pointer ml-1'
                  onClick={() => shareBlog(blog)}
                  title="Share this post"
                >
                  <i className='bx bx-share-alt text-[1.125rem] sm:text-lg'></i>
                </div>
                {(isAuthenticated && !editable && (blog?.author?._id === userInfo?._id)) && (
                  <div className='flex flex-row items-center justify-center gap-1 sm:gap-1.5 hover:text-gray-500 transition-colors cursor-pointer ml-1' onClick={handleEdit}>
                    <i className='bx bxs-pencil text-[1.125rem] sm:text-lg shrink-0'></i>
                  </div>
                )}
              </div>
            </div>
            <div className='blogContent '>

              <div className='h-96 overflow-hidden ' >
                <img className='w-full h-full object-cover ' src={blog?.coverImage} alt="" />
              </div>
              <div className='mt-8 pl-4 sm:pl-6 border-l-4 border-pink-700 dark:border-pink-500 py-2'>
                <p className='text-base sm:text-lg italic text-gray-700 dark:text-gray-300 leading-relaxed font-medium'>
                  {blog?.summary}
                </p>
              </div>
              <style>{`
                .blog-drop-cap > p:first-of-type::first-letter {
                  float: left;
                  font-size: 3.75rem;
                  line-height: 1;
                  font-weight: 700;
                  color: #b8004e;
                  margin-right: 0.75rem;
                  margin-top: 0.25rem;
                }
                .dark .blog-drop-cap > p:first-of-type::first-letter {
                  color: #ec4899;
                }
              `}</style>
              <div 
                className='my-8 text-base ql-editor !p-0 blog-drop-cap' 
                dangerouslySetInnerHTML={{ __html: blog?.content }} 
              />
            </div>
          </div>

          {moreBlogs?.length > 0 && (
            <div className="w-full px-4 lg:px-64 my-12 pb-8">
              <div className="relative pl-6 py-1 mb-10 border-l-[3px] border-[#b8004e]">
                <div className="flex flex-row items-center gap-3 sm:gap-5">
                  <h3 className="text-lg sm:text-[28px] font-bold tracking-tight text-[#1a1a1a] dark:text-gray-100 flex items-center min-w-0 overflow-hidden">
                    <span className="whitespace-nowrap">More from </span>
                    <Tooltip 
                      title={blog?.author?.name?.length > 15 ? blog?.author?.name : ""} 
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
                      <a href={`/profile/${blog?.author?._id}/${slugify(blog?.author?.name)}`} className="text-[#b8004e] transition-colors duration-200 cursor-pointer truncate ml-1">{blog?.author?.name}</a>
                    </Tooltip>
                  </h3>
                  {(isAuthenticated && userInfo?._id !== blog?.author?._id) && (
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`px-4 sm:px-6 py-1 sm:py-1.5 text-xs sm:text-sm font-bold rounded-full transition-all duration-300 shrink-0 ${isFollowingAuthor ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-500 border border-gray-200 dark:border-gray-700' : 'bg-[#b8004e] text-white hover:bg-[#d81b60] shadow-sm'}`}
                    >
                      {isFollowingAuthor ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {moreBlogs.map(b => (
                  <a href={`/blogs/${b?._id}/${slugify(b?.title)}`} key={b?._id} className="group flex flex-col gap-3">
                    <div className="w-full aspect-[4/3] rounded-[20px] overflow-hidden shadow-sm">
                      <img src={b?.coverImage} alt={b?.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    </div>
                    <div className="mt-2">
                      <h3 className="font-bold text-[17px] leading-snug line-clamp-2 group-hover:text-[#b8004e] transition-colors duration-300">{b?.title}</h3>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div id='comments' className="comment_section w-full px-4 lg:px-64 my-8 pb-10">
            <h1 className='font-bold text-2xl sm:text-3xl lg:text-4xl inline-block border-b-4 border-[#b8004e] pb-1 mb-8'>Comments</h1>
            {isAuthenticated ? (
              <CommentSection singleBlogId={blog?._id} blogAuthorId={blog?.author?._id} blogAuthorImage={profileImageUrl} />
            ) : (
              <div className="mt-4 py-6 text-center border border-gray-200 dark:border-gray-800 rounded-xl">
                <p className="text-sm opacity-60 mb-3">Sign in to join the conversation</p>
                <Link to="/login" className="text-sm font-semibold px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors inline-block">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (

        <EditBlog editable={editable} setEditable={setEditable} handleEdit={handleEdit} singleBlog={blog} />
      )}
    </div>
  )
}

export default SingleBlog
