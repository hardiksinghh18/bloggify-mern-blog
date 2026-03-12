import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CoverSection from '../components/Blog/CoverSection'
import FeaturedSection from '../components/FeaturedSection'
import HomePageLoading from '../components/LoadingSkeletons/HomePageLoading'
import { useSelector, useDispatch } from 'react-redux'
import { selectIsAuthenticated, selectUserInfo } from '../features/auth/authSlice'
import { setCredentials } from '../features/auth/authSlice'
import { useGetDashboardQuery, useGetPublicBlogsQuery } from '../features/blogs/blogsApiSlice'

const Home = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userInfo = useSelector(selectUserInfo);

  // Use dashboard query if authenticated (gets user data + blogs), otherwise use public blogs
  const { data: dashboardData, isLoading: dashLoading, isSuccess: dashSuccess } = useGetDashboardQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: publicData, isLoading: publicLoading } = useGetPublicBlogsQuery(undefined, {
    skip: isAuthenticated,
  });

  useEffect(() => {
    if (dashSuccess && dashboardData?.valid) {
      dispatch(setCredentials({ user: dashboardData.user, valid: dashboardData.valid }));
    }
  }, [dashSuccess, dashboardData, dispatch]);

  const isLoading = isAuthenticated ? dashLoading : publicLoading;
  const blogsData = isAuthenticated ? dashboardData?.allBlogs : publicData?.allBlogs;

  if (isLoading) {
    return (
      <HomePageLoading />
    )
  }

  return (
    <div className='w-full'>

      {isAuthenticated && <CoverSection userName={userInfo?.name} />}

      {!isAuthenticated && (
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 md:px-12 pt-8 sm:pt-12 pb-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome to Bloggify ✍️
            </h1>
            <p className="text-sm sm:text-base opacity-60 font-medium mt-1">
              Read, write, and share stories that matter — your ideas deserve a voice.
            </p>
            <div className="mt-4">
              <Link to="/login" className="text-sm font-semibold px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors inline-block">
                Login
              </Link>
            </div>
          </div>
        </div>
      )}

      {blogsData && <FeaturedSection blogsData={blogsData} />}
    </div>
  )
}

export default Home
