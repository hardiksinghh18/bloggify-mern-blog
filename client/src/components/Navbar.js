import React, { useEffect, useState } from 'react'
import axios from 'axios'
import 'boxicons'
import Logo from '../images/Logo.png'
import defaultProfile from '../images/defaultProfile.jpg'


import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../context/userContext'
import { useThemeSwitch } from '../hooks/useThemeSwitch'
import { toast } from 'react-toastify';
const Navbar = () => {
  const { userInfo, setUserInfo, isAuthenticated, setIsAuthenticated } = useAuthContext()
  const navigate = useNavigate()
  const [userDetails, setUserDetails] = useState()
  const [mode, setMode] = useThemeSwitch();
  const [click, setClick] = useState(false);

  axios.defaults.withCredentials = true;

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {

      document.cookie = 'accessToken + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = 'refreshToken + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      // axios.get('https://bloggify-jet.vercel.app/logout')

      //   .then(res => {
      //     if (!res.data.valid) {

      //       toast.success('Logout Successful')
      //       setIsAuthenticated(false)
      //       setUserInfo('')
      //       navigate('/')
      //     }
      //   }).catch(err => console.log(err))
    }


  }

  // console.log(userInfo)


  const toggle = () => {
    setClick(!click)
  }


  const profileImage = userInfo?.profileImage ? userInfo?.profileImage : defaultProfile

  return (

    <header className=" px-0   mx-1 my-2  flex items-center justify-between  z-50 sm:mx-8 sm:py-1 ">

      <a href='/'>
        <img className='h-12 w-12' src={Logo} alt="" />
      </a>






      <nav className=" w-max py-3   px-3   border border-solid border-black rounded-full font-medium capitalize  items-center  flex text-xs
    fixed top-2 right-1/2 translate-x-1/2 bg-light/80 backdrop-blur-sm z-50  sm:py-3 sm:px-8 sm:text-[1rem] sm:my-1 ">
        <Link to="/" className="mr-2">Home</Link>

        {isAuthenticated ? (
          <div>
            <Link to={'/blogs'} className="mx-2">Blogs</Link>
            <Link to={'/newpost'} className="mx-2  "    ><span>New</span> <i className='bx bxs-pencil mx-1'></i></Link>
            {/* <Link onClick={handleLogout} className="mx-2">Logout</Link> */}

          </div>
        ) : (<div>
          <Link to={"/blogs"} className="mx-2">Blogs</Link>
          <Link to={"/login"} className="mx-2">Login</Link>
        </div>
        )}



      </nav>


      <div className="sm:flex items-center relative">
        {userInfo && (
          <div className="flex items-center hover:cursor-pointer relativeProfile ">
            <img

              src={profileImage}
              alt="Profile"
              className="h-8 w-8 mr-4 rounded-full  "
            />
            <div className=' relative font-semibold '>
              <p className='hidden  sm:flex sm:items-center'>

                {userInfo?.name} <span className='text-xs mx-2 '><i className='bx bxs-down-arrow'></i></span>
              </p>
              <div className="hidden absoluteProfile absolute bg-white  z-50  flex-col justify-between p-4 border border-gray-300 rounded-lg top-2 lg:top-6 right-0 mt-1 min-w-32">

                <a href={`/profile/${userInfo?._id}/${userInfo?.name}`} className='w-full mt-2'><p className='text-sm hover:text-gray-600'> Profile</p></a>
                <button onClick={handleLogout} className='flex items-start mt-2'><p className='text-sm hover:text-gray-600'>Logout <i className='bx bx-log-in'></i></p></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
