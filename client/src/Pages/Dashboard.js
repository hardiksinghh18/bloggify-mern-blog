import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/userContext'
import { useBlogContext } from '../context/BlogContext'
import BlogLayoutOne from '../components/Blog/BlogLayoutOne'
import BlogLayoutThree from '../components/Blog/BlogLayoutThree'
import LoadingSkeleton from '../components/LoadingSkeletons/LoadingSkeleton'
import LoadingNew from '../components/LoadingSkeletons/LoadingNew'


const Dashboard = () => {
  const { userInfo, setUserInfo, isAuthenticated, setIsAuthenticated } = useAuthContext()
  const { blogsData, setBlogsData, loading, setLoading } = useBlogContext()
  const [userDetails, setUserDetails] = useState([])
  const navigate = useNavigate()

  axios.defaults.withCredentials = true;


  const fetchData = async () => {

    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/dashboard`)
      if (res?.data?.valid) {
        setUserDetails(res?.data?.user)
        setBlogsData(res?.data?.allBlogs)
        setIsAuthenticated(true)

      } else {
        navigate('/login')

      }
    } catch (error) {
      console.log(error)
    }
  }



  useEffect(() => {

   fetchData()

  }, [])


  if (loading) {
    return (
      // <div className='h-screen flex justify-center items-center'>Loading...</div>
      // <LoadingSkeleton/>
      <LoadingNew/>
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
                {blogsData&& blogsData[0] && <BlogLayoutOne blog={blogsData[0]} />}
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
