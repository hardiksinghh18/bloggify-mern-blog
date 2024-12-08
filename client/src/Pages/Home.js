import React,{useState,useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CoverSection from '../components/Blog/CoverSection'
import { useBlogContext } from '../context/BlogContext'
import FeaturedSection from '../components/FeaturedSection'
import { useAuthContext } from '../context/userContext'
import Footer from '../components/Footer'
import axios from 'axios'
import HomePageLoading from '../components/LoadingSkeletons/HomePageLoading'
const Home = () => {
  const { userInfo, setUserInfo, isAuthenticated, setIsAuthenticated } = useAuthContext()
  const { blogsData, setBlogsData, loading, setLoading } = useBlogContext()
  const [userDetails, setUserDetails] = useState([])
  const navigate = useNavigate()

  const fetchData = async () => {

    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/dashboard`)
      if (res?.data?.valid) {
        // setUserDetails(res?.data?.user)
        setBlogsData(res?.data?.allBlogs)
        setIsAuthenticated(true)

      } else {
        navigate('/')

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
     
      <HomePageLoading/>
    )
  }


  return (
    <div className='inline-block'>
    
      <CoverSection />


      {
        isAuthenticated ? 
       ( blogsData &&  <FeaturedSection blogsData={blogsData} />)
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
