import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CoverSection from '../components/Blog/CoverSection'
import FeaturedSection from '../components/FeaturedSection'
import HomePageLoading from '../components/LoadingSkeletons/HomePageLoading'
import { useSelector, useDispatch } from 'react-redux'
import { selectIsAuthenticated } from '../features/auth/authSlice'
import { setCredentials } from '../features/auth/authSlice'
import { useGetDashboardQuery } from '../features/blogs/blogsApiSlice'

const Home = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { data, isLoading, isSuccess } = useGetDashboardQuery();

  useEffect(() => {
    if (isSuccess && data?.valid) {
      dispatch(setCredentials({ user: data.user, valid: data.valid }));
    }
  }, [isSuccess, data, dispatch]);

  if (isLoading) {
    return (
      <HomePageLoading />
    )
  }

  const blogsData = data?.allBlogs;

  return (
    <div className='inline-block'>

      <CoverSection />

      {
        isAuthenticated ?
          (blogsData && <FeaturedSection blogsData={blogsData} />)
          : (
            <div className='mt-16 flex flex-col justify-center items-center'>
              <h1 className='font-semibold text-sm sm:text-2xl '>Please login or signup to access Blogs </h1>

              <div className=' font-semibold my-4 border text-xs border-black p-2 rounded-lg '><Link to={'/login'}>Login</Link></div>
            </div>
          )
      }
    </div>
  )
}

export default Home
