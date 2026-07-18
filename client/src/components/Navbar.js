import React, { useEffect, useState, useRef } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import 'boxicons'
import Logo from '../images/Logo.png'
import defaultProfile from '../images/defaultProfile.jpg'

import { useNavigate, NavLink, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectIsAuthenticated, selectUserInfo, logout as logoutAction, setCredentials } from '../features/auth/authSlice'
import { useLogoutMutation, useGetMeQuery } from '../features/auth/authApiSlice'
import { apiSlice } from '../features/api/apiSlice'
import { useThemeSwitch } from '../hooks/useThemeSwitch'
import { toast } from 'react-toastify';
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";



const Navbar = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate()
  const [mode, setMode] = useThemeSwitch();
  const [logoutApi] = useLogoutMutation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch only user data to populate auth state
  const { data: meData, isSuccess } = useGetMeQuery();

  useEffect(() => {
    if (isSuccess && meData?.valid) {
      dispatch(setCredentials({ user: meData.user, valid: meData.valid }));
    }
  }, [isSuccess, meData, dispatch]);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = mode === "light" ? "dark" : "light";
    setMode(newTheme);
  };

  const handleLogoutClick = () => {
    setConfirmOpen(true);
  }

  const handleLogoutConfirm = async () => {
    setConfirmOpen(false);
    try {
      const res = await logoutApi().unwrap();
      if (!res.valid) {
        toast.success('Logout Successful')
        dispatch(logoutAction());
        dispatch(apiSlice.util.resetApiState()); // Clear RTK Query cache
        navigate('/')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const profileImage = userInfo?.profileImage ? userInfo?.profileImage : defaultProfile

  return (

    <header className=" px-0   mx-1 my-2  flex items-center justify-between  z-50 sm:mx-8 sm:py-1 ">

      <a href='/'>
        <img className='h-12 w-12' src={Logo} alt="" />
      </a>


      <nav className=" w-max py-3   px-3   border border-solid border-black rounded-full font-medium capitalize  items-center  flex text-xs
    fixed top-2 right-1/2 translate-x-1/2 bg-light/80 backdrop-blur-sm z-50  sm:py-3 sm:px-8 sm:text-[1rem] sm:my-1 ">
        <NavLink to="/" activeClassName="active" className="mr-2">Home</NavLink>

        {isAuthenticated ? (
          <div>
            <NavLink to={'/blogs'} className="mx-2" activeclassname="active">Blogs</NavLink>
            <NavLink to={'/newpost'} className="mx-2  " activeclassname="active" ><span>New</span> <i className='bx bxs-pencil mx-1'></i></NavLink>
          </div>
        ) : (<div>
          <NavLink to={"/blogs"} className="mx-2 " activeclassname="active">Blogs</NavLink>
          <NavLink to={"/login"} className="mx-2" activeclassname="active">Login</NavLink>
        </div>
        )}
        <button className="theme-toggle-btn ml-4 text-lg" onClick={toggleTheme}>
          {mode === "light" ? (<MdDarkMode />) : <MdLightMode />}
        </button>
      </nav>

      <div className="sm:flex items-center relative" ref={menuRef}>
        {userInfo && (
          <div onClick={() => setMenuOpen(!menuOpen)} className="flex items-center hover:cursor-pointer relativeProfile ">
            <img
              src={profileImage}
              alt="Profile"
              className="h-8 w-8 mr-4 rounded-full"
            />
            <div className=' relative font-semibold '>
              <p className='hidden  md:flex md:items-center min-w-0'>
                <span className="truncate max-w-[120px]">{userInfo?.name}</span>
                <span className={`text-xs mx-2 transition-transform duration-300 inline-block ${menuOpen ? 'rotate-180' : ''}`}><i className='bx bxs-down-arrow'></i></span>
              </p>
              {menuOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absoluteProfile absolute z-50 flex flex-col p-2.5 border rounded-2xl top-full right-0 mt-3 min-w-[240px] bg-white dark:bg-[#1a1a1a] border-gray-100 dark:border-zinc-800/80 shadow-2xl shadow-gray-200/50 dark:shadow-none"
                >
                  {/* User Profile Info Header inside Card */}
                  <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-100 dark:border-zinc-800/80 mb-2">
                    <img
                      src={profileImage}
                      alt="User Profile"
                      className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-zinc-800"
                    />
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-[14px] font-bold text-gray-900 dark:text-white truncate">{userInfo?.name}</span>
                      <span className="text-[11px] font-medium text-gray-400 dark:text-zinc-500 truncate">{userInfo?.email}</span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <Link
                    to={`/profile/${userInfo?.username}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/40 text-gray-700 dark:text-zinc-300 hover:text-[#b8004e] dark:hover:text-[#d81b60] transition-all group"
                  >
                    <i className='bx bx-user text-[18px] text-gray-400 group-hover:text-[#b8004e] dark:group-hover:text-[#d81b60] transition-colors'></i>
                    <span className="text-sm font-semibold transition-colors">Profile</span>
                  </Link>

                  <button 
                    onClick={() => { setMenuOpen(false); handleLogoutClick(); }} 
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 transition-all group w-full text-left"
                  >
                    <i className='bx bx-log-out text-[18px] text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors'></i>
                    <span className="text-sm font-semibold transition-colors">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: '20px',
            padding: '8px',
            backgroundColor: 'var(--profile-bg)',
            color: 'var(--profile-text)',
            border: '1px solid var(--profile-border)',
            backgroundImage: 'none',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }
        }}
      >
        <DialogTitle id="logout-dialog-title" sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Are you sure you want to log out of your Bloggify account?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 2 }}>
          <Button 
            onClick={() => setConfirmOpen(false)}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 600, 
              color: 'text.secondary',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleLogoutConfirm}
            variant="contained"
            className="bg-[#b8004e] hover:bg-[#9a0042]"
            sx={{ 
              textTransform: 'none', 
              fontWeight: 600, 
              bgcolor: '#b8004e',
              color: '#ffffff',
              px: 3,
              '&:hover': { bgcolor: '#9a0042' }
            }}
            autoFocus
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </header>
  )
}

export default Navbar
