import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../features/auth/authSlice'
import { useGetDashboardQuery, useGetTrendingBlogsQuery, blogsApiSlice } from '../features/blogs/blogsApiSlice'
import BlogLayoutThree from '../components/Blog/BlogLayoutThree'
import LoadingNew from '../components/LoadingSkeletons/LoadingNew'
import { Pagination } from '@mui/material'


const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('latest')
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isSuccess, isError } = useGetDashboardQuery({ page, limit });
  const { data: trendingData, isLoading: trendingLoading } = useGetTrendingBlogsQuery(limit);
  
  const prefetchDashboard = blogsApiSlice.usePrefetch('getDashboard');

  useEffect(() => {
    if (isSuccess && data?.valid) {
      dispatch(setCredentials({ user: data.user, valid: data.valid }));
      
      // Prefetch next page
      const totalPages = Math.ceil((data?.totalBlogs || 0) / limit);
      if (page < totalPages) {
        prefetchDashboard({ page: page + 1, limit });
      }
    } else if (isSuccess && !data?.valid) {
      navigate('/login');
    }
  }, [isSuccess, data, dispatch, navigate, page, prefetchDashboard]);

  useEffect(() => {
    if (isError) {
      navigate('/login');
    }
  }, [isError, navigate]);

  const blogsData = data?.allBlogs;
  const trendingBlogs = trendingData?.trendingBlogs;
  const totalBlogs = data?.totalBlogs || 0;
  const totalPages = Math.ceil(totalBlogs / limit);

  if (isLoading) {
    return (
      <LoadingNew />
    )
  }

  const displayedBlogs = activeTab === 'latest' ? blogsData : trendingBlogs;
  const isTabLoading = activeTab === 'trending' && trendingLoading;

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>

      {blogsData &&
        <div className=' w-screen px-0 mx-0 flex flex-col items-center pb-16'>

          <div className='w-full max-w-5xl flex flex-col px-4 sm:px-8 lg:px-16 my-8 items-center mx-auto'>

            {/* Tab Switcher */}
            <div className='w-full flex items-center gap-2 mb-8 border-b border-gray-200 dark:border-gray-800'>
              <button
                onClick={() => {
                  setActiveTab('latest')
                  setPage(1)
                }}
                className={`relative px-4 py-3 text-sm sm:text-base font-bold transition-all duration-200 ${activeTab === 'latest'
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                Latest
                {activeTab === 'latest' && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#b8004e] rounded-t-full"></span>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab('trending')
                  setPage(1)
                }}
                className={`relative px-4 py-3 text-sm sm:text-base font-bold transition-all duration-200 flex items-center gap-2 ${activeTab === 'trending'
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                <i className={`bx bxs-hot text-lg ${activeTab === 'trending' ? 'text-orange-500' : ''}`}></i>
                Trending
                {activeTab === 'trending' && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#b8004e] rounded-t-full"></span>
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
                  <>
                    <div className='flex flex-col w-full mb-8'>
                      {displayedBlogs.map((blog) => (
                        <div key={blog?._id} className='w-full'>
                          <BlogLayoutThree blog={blog} />
                        </div>
                      ))}
                    </div>

                    {activeTab === 'latest' && totalPages > 1 && (
                      <div className='flex justify-center mt-8'>
                        <Pagination
                          count={totalPages}
                          page={page}
                          onChange={handlePageChange}
                          color="primary"
                          sx={{
                            '& .MuiPaginationItem-root': {
                              color: 'inherit',
                            }
                          }}
                        />
                      </div>
                    )}
                  </>
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
