import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import defaultProfile from '../images/defaultProfile.jpg'
import 'react-quill/dist/quill.snow.css';
import { useSelector } from 'react-redux'
import { selectUserInfo, selectIsAuthenticated } from '../features/auth/authSlice'
import {
  useGetDashboardQuery,
  useGetPublicBlogsQuery,
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

const SingleBlog = () => {
  const userInfo = useSelector(selectUserInfo);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { id } = useParams();
  const [editable, setEditable] = useState(false);

  // Use dashboard if authenticated, public blogs otherwise
  const { data: dashboardData, isLoading: dashLoading } = useGetDashboardQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: publicData, isLoading: publicLoading } = useGetPublicBlogsQuery(undefined, {
    skip: isAuthenticated,
  });

  const { data: allComments = [] } = useGetCommentsQuery();
  const [incrementViews] = useIncrementViewsMutation();
  const [likeBlogApi] = useLikeBlogMutation();
  const [dislikeBlogApi] = useDislikeBlogMutation();
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

  const isLoading = isAuthenticated ? dashLoading : publicLoading;
  const blogsData = isAuthenticated ? dashboardData?.allBlogs : publicData?.allBlogs;
  const singleBlogDetail = blogsData?.filter((blog) => blog._id === id);
  const blogComments = allComments?.filter((item) => item.blogId === id) || [];

  // Show loading skeleton while loading
  if (isLoading || !singleBlogDetail || singleBlogDetail.length === 0) {
    return <BlogLoadingSkeleton />;
  }

  // Safely access singleBlogDetail[0]
  const blog = singleBlogDetail[0];
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

  return (
    <div >
      {!editable ? (
        <div>
          <div className=' px-4 lg:px-64 py-4 lg:py-8 flex flex-col items-center justify-center w-full'>
            <div><h2 className=' lg:my-2 sm:text-2xl md:text-3xl lg:text-4xl font-bold'>{singleBlogDetail[0]?.title}</h2></div>
            <div className='flex flex-row justify-between w-full items-center my-6'>
              <div className='flex justify-start gap-3 sm:gap-4 items-center overflow-hidden'>
                <a href={`/profile/${singleBlogDetail[0]?.author?._id}/${singleBlogDetail[0]?.author?.name}`} className="shrink-0 flex items-center">
                  <img className='h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover' src={profileImageUrl} alt="" />
                </a>
                <div className='min-w-0'>
                  <a href={`/profile/${singleBlogDetail[0]?.author?._id}/${singleBlogDetail[0]?.author?.name}`} className="font-semibold text-[13px] sm:text-base block truncate" >{singleBlogDetail[0]?.author?.name}</a>
                  {formattedDate && <p className=" text-[11px] sm:text-sm truncate">{formattedDate}</p>}
                </div>
              </div>

              <div className='flex items-center justify-end gap-4 sm:gap-6 shrink-0'>
                <div className='flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5'>
                  <VisibilityOutlinedIcon fontSize="small" />
                  <span className='text-[11px] sm:text-sm font-medium leading-none'>{singleBlogDetail[0]?.views}</span>
                </div>
                <div
                  className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 transition-colors ${isAuthenticated ? 'cursor-pointer hover:text-blue-500' : 'opacity-60'}`}
                  onClick={handleLike}
                  title={isAuthenticated ? '' : 'Sign in to like'}
                >
                  {hasLiked ? <ThumbUpIcon fontSize="small" className="text-blue-500" /> : <ThumbUpOutlinedIcon fontSize="small" />}
                  <span className='text-[11px] sm:text-sm font-medium leading-none'>{blog?.likes?.length || 0}</span>
                </div>
                <div
                  className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 transition-colors ${isAuthenticated ? 'cursor-pointer hover:text-red-500' : 'opacity-60'}`}
                  onClick={handleDislike}
                  title={isAuthenticated ? '' : 'Sign in to dislike'}
                >
                  {hasDisliked ? <ThumbDownIcon fontSize="small" className="text-red-500" /> : <ThumbDownOutlinedIcon fontSize="small" />}
                  <span className='text-[11px] sm:text-sm font-medium leading-none'>{blog?.dislikes?.length || 0}</span>
                </div>
                <div className='flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 hover:text-gray-500 transition-colors cursor-pointer'>
                  <a href='#comments' className='flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5'>
                    <ChatBubbleOutlineIcon fontSize="small" />
                    <span className='text-[11px] sm:text-sm font-medium leading-none'>{blogComments.length}</span>
                  </a>
                </div>
                <div
                  className='flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 hover:text-green-500 transition-colors cursor-pointer'
                  onClick={() => shareBlog(blog)}
                  title="Share this post"
                >
                  <i className='bx bx-share-alt text-[1.125rem] sm:text-lg'></i>
                </div>
                {(isAuthenticated && !editable && (singleBlogDetail[0]?.author?._id === userInfo?._id)) && (
                  <div className='flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 hover:text-gray-500 transition-colors cursor-pointer' onClick={handleEdit}>
                    <i className='bx bxs-pencil text-[1.125rem] sm:text-lg shrink-0'></i>
                  </div>
                )}
              </div>
            </div>
            <div className='blogContent '>

              <div className='h-96 overflow-hidden ' >
                <img className='w-full h-full object-cover ' src={singleBlogDetail[0]?.coverImage} alt="" />
              </div>
              <div>
                <p className=' mt-8 text-sm'><i>Summary : {singleBlogDetail[0]?.summary}</i></p>
              </div>
              <div className='my-8 text-base ql-editor !p-0' dangerouslySetInnerHTML={{ __html: singleBlogDetail[0]?.content }} />
            </div>
          </div>

          <div id='comments' className="comment_section w-full px-4 lg:px-64   my-8 ">
            <h1 className='font-bold text-sm sm:text-lg lg:text-xl'>Commments</h1>
            {isAuthenticated ? (
              <CommentSection singleBlogId={singleBlogDetail[0]?._id} blogAuthorId={singleBlogDetail[0]?.author?._id} blogAuthorImage={profileImageUrl} />
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

        <EditBlog editable={editable} setEditable={setEditable} handleEdit={handleEdit} singleBlog={singleBlogDetail[0]} />
      )}
    </div>
  )
}

export default SingleBlog
