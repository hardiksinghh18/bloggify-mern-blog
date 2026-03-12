import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../features/auth/authSlice'
import { useGetDashboardQuery, useGetTrendingBlogsQuery } from '../features/blogs/blogsApiSlice'
import BlogLayoutThree from '../components/Blog/BlogLayoutThree'
import LoadingNew from '../components/LoadingSkeletons/LoadingNew'


const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('latest')

  const { data, isLoading, isSuccess, isError } = useGetDashboardQuery();
  const { data: trendingData, isLoading: trendingLoading } = useGetTrendingBlogsQuery(10);

  useEffect(() => {
    if (isSuccess && data?.valid) {
      dispatch(setCredentials({ user: data.user, valid: data.valid }));
    } else if (isSuccess && !data?.valid) {
      navigate('/login');
    }
  }, [isSuccess, data, dispatch, navigate]);

  useEffect(() => {
    if (isError) {
      navigate('/login');
    }
  }, [isError, navigate]);

  const blogsData = data?.allBlogs;
  const trendingBlogs = trendingData?.trendingBlogs;

  if (isLoading) {
    return (
      <LoadingNew />
    )
  }

  const displayedBlogs = activeTab === 'latest' ? blogsData : trendingBlogs;
  const isTabLoading = activeTab === 'trending' && trendingLoading;

  return (
    <>

      {blogsData &&
        <div className=' w-screen px-0 mx-0 flex flex-col items-center '>

          <div className='w-full max-w-5xl flex flex-col px-4 sm:px-8 lg:px-16 my-8 items-center mx-auto'>

            {/* Tab Switcher */}
            <div className='w-full flex items-center gap-0 mb-2 border-b dark:border-gray-400'>
              <button
                onClick={() => setActiveTab('latest')}
                className={`relative px-5 py-3 text-sm sm:text-base font-semibold transition-colors duration-200 ${activeTab === 'latest'
                    ? ''
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Latest
                {activeTab === 'latest' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('trending')}
                className={`relative px-5 py-3 text-sm sm:text-base font-semibold transition-colors duration-200 flex items-center gap-1.5 ${activeTab === 'trending'
                    ? ''
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
                </svg>
                Trending
                {activeTab === 'trending' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                )}
              </button>
            </div>

            {/* Content */}
            {isTabLoading ? (
              <div className="w-full flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className='flex flex-col w-full'>
                {displayedBlogs && displayedBlogs.length > 0 ? (
                  displayedBlogs.map((blog) => (
                    <div key={blog?._id} className='w-full'>
                      <BlogLayoutThree blog={blog} />
                    </div>
                  ))
                ) : (
                  activeTab === 'trending' && (
                    <div className="w-full text-center py-12 opacity-50">
                      <p className="text-sm">No trending blogs yet. Start engaging with content!</p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>}

    </>
  )
}

export default Dashboard
