import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../features/auth/authSlice'
import { useGetDashboardQuery } from '../features/blogs/blogsApiSlice'
import BlogLayoutOne from '../components/Blog/BlogLayoutOne'
import BlogLayoutThree from '../components/Blog/BlogLayoutThree'
import LoadingNew from '../components/LoadingSkeletons/LoadingNew'


const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { data, isLoading, isSuccess, isError } = useGetDashboardQuery();

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

  if (isLoading) {
    return (
      <LoadingNew />
    )
  }

  return (
    <>

      {blogsData &&
        <div className=' w-screen px-0 mx-0 flex flex-col items-center '>

          <div className='  sm:px-8   '>
            <h1 className='font-bold  text-lg sm:text-2xl w-full px-6 lg:px-12  py-3 sm:my-6   '>Recent Blogs</h1>

            <div className='flex gap-4  px-4 overflow-x-scroll lg:justify-center w-screen  lg:overflow-x-hidden  '>
              <div>
                {blogsData && blogsData[0] && <BlogLayoutOne blog={blogsData[0]} />}
              </div>
              <div>
                {blogsData && blogsData[1] && <BlogLayoutOne blog={blogsData[1]} />}
              </div>
              <div>
                {blogsData && blogsData[2] && <BlogLayoutOne blog={blogsData[2]} />}
              </div>
            </div>

          </div>

          <div className='w-screen flex flex-col px-2 lg:px-16 my-8 items-center '>

            <h1 className='font-bold text-lg sm:text-2xl w-full px-6 lg:px-12 my-4 '>All Blogs</h1>
            <div className='flex gap-2 lg:gap-8 flex-wrap items-center justify-center lg:justify-start  '>

              {blogsData && blogsData?.map((blog, index) => {
                return (

                  <div key={blog?._id} className='flex '>
                    <article className=" col-span-2  sxl:col-span-1 row-span-2 relative">
                      <BlogLayoutThree blog={blog} />
                    </article>
                  </div>

                )
              })}
            </div>
          </div>
        </div>}

    </>
  )
}

export default Dashboard
