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
import { getProfileImage } from '../Utils'

const Navbar = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate()
  const [mode, setMode] = useThemeSwitch();
  const [logoutApi] = useLogoutMutation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  useEffect(() => {
    const elements = [
      document.querySelector('main'),
      document.querySelector('footer')
    ];
    if (drawerOpen && window.innerWidth >= 640) {
      elements.forEach(el => el?.classList.add('drawer-push-active'));
    } else {
      elements.forEach(el => el?.classList.remove('drawer-push-active'));
    }
    
    return () => {
      elements.forEach(el => el?.classList.remove('drawer-push-active'));
    };
  }, [drawerOpen]);

  const profileImage = getProfileImage(userInfo?.profileImage, defaultProfile)

  return (
    <>
      <header className="sticky top-0 w-full bg-white/80 dark:bg-[#18181b]/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800/80 px-6 sm:px-12 py-3 flex items-center justify-between z-50 transition-all duration-300 shadow-sm">
        
        {/* Logo & Brand Name */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={`menu-toggle-btn text-gray-700 dark:text-zinc-300 ${drawerOpen ? 'open' : ''}`}
            title={drawerOpen ? "Close Menu" : "Open Menu"}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <a href='/' className="flex items-center gap-2 group">
            <img className='h-8 w-8 group-hover:scale-105 transition-transform duration-300' src={Logo} alt="Bloggify Logo" referrerPolicy="no-referrer" />
            <span className="font-extrabold text-xl tracking-tight hidden sm:block bg-gradient-to-r from-[#b8004e] to-[#db2777] bg-clip-text text-transparent group-hover:opacity-95 transition-opacity">
              Bloggify
            </span>
          </a>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-3 sm:gap-6">

          {isAuthenticated ? (
            <NavLink 
              to="/newpost" 
              activeclassname="active" 
              className="flex items-center gap-1.5 text-[13px] font-bold border border-[#b8004e]/20 dark:border-pink-500/30 bg-[#b8004e]/10 dark:bg-pink-500/10 text-[#b8004e] dark:text-pink-400 hover:bg-[#b8004e]/20 dark:hover:bg-pink-500/20 px-3 sm:px-4 py-1.5 rounded-full transition-all duration-300 transform active:scale-95 shadow-sm"
            >
              <i className='bx bx-edit-alt text-base'></i>
              <span className="hidden sm:inline">Write</span>
            </NavLink>
          ) : (
            <NavLink 
              to="/login" 
              activeclassname="active" 
              className="text-[14px] font-semibold text-gray-600 dark:text-zinc-300 hover:text-[#b8004e] dark:hover:text-pink-400 transition-colors"
            >
              Login
            </NavLink>
          )}

          {/* Theme switch */}
          <button 
            className="theme-toggle-btn text-[17px] text-gray-600 dark:text-zinc-300 hover:text-[#b8004e] dark:hover:text-pink-400 transition-colors flex items-center hover:scale-110 active:scale-95 duration-200" 
            onClick={toggleTheme}
          >
            {mode === "light" ? <MdDarkMode /> : <MdLightMode />}
          </button>

          {/* Profile Dropdown */}
          {userInfo && (
            <div className="flex items-center relative" ref={menuRef}>
              <div 
                onClick={() => setMenuOpen(!menuOpen)} 
                className="flex items-center hover:cursor-pointer relativeProfile"
              >
                <img
                  src={profileImage}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="h-8 w-8 rounded-full border border-gray-100 dark:border-zinc-800 object-cover"
                />
                <div className="relative font-semibold ml-2">
                  <p className="hidden md:flex md:items-center min-w-0">
                    <span className="truncate max-w-[120px] text-sm text-gray-700 dark:text-zinc-300">{userInfo?.name}</span>
                    <span className={`text-xs ml-1 transition-transform duration-300 inline-block ${menuOpen ? 'rotate-180' : ''}`}>
                      <i className='bx bxs-down-arrow text-[10px] text-gray-400'></i>
                    </span>
                  </p>
                  {menuOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absoluteProfile absolute z-50 flex flex-col p-2.5 border rounded-2xl top-full right-0 mt-3 min-w-[240px] bg-white dark:bg-[#1a1a1a] border-gray-100 dark:border-zinc-800/80 shadow-2xl shadow-gray-200/50 dark:shadow-none animate-dropdown-in"
                    >
                      {/* User Profile Info Header inside Card */}
                      <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-100 dark:border-zinc-800/80 mb-2">
                        <img
                          src={profileImage}
                          alt="User Profile"
                          referrerPolicy="no-referrer"
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
            </div>
          )}
        </div>
      </header>

      {/* Drawer Container */}
      <div className={`fixed top-[61px] left-0 w-full sm:w-[280px] h-[calc(100vh-61px)] z-40 transition-all duration-300 ${drawerOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        {/* Backdrop */}
        <div 
          onClick={() => setDrawerOpen(false)}
          className="absolute inset-0 bg-black/40 sm:hidden backdrop-blur-sm transition-opacity duration-300"
        />
        {/* Drawer Panel */}
        <div className={`absolute top-0 left-0 h-full w-[280px] bg-white dark:bg-[#18181b] p-6 flex flex-col gap-6 drawer-panel-transition border-r border-gray-150 dark:border-zinc-800/80 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>

          {/* Drawer Links */}
          <div className="flex flex-col gap-1">
            <NavLink 
              to="/" 
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/40 text-gray-700 dark:text-zinc-300 font-bold transition-all text-sm"
            >
              <i className='bx bx-home text-lg'></i>
              <span>Home</span>
            </NavLink>

            <NavLink 
              to="/blogs" 
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/40 text-gray-700 dark:text-zinc-300 font-bold transition-all text-sm"
            >
              <i className='bx bx-compass text-lg'></i>
              <span>Explore</span>
            </NavLink>

            {isAuthenticated && (
              <NavLink 
                to="/my-blogs" 
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/40 text-gray-700 dark:text-zinc-300 font-bold transition-all text-sm"
              >
                <i className='bx bx-grid-alt text-lg'></i>
                <span>Manage Blogs</span>
              </NavLink>
            )}

            {isAuthenticated ? (
              <>
                <NavLink 
                  to="/newpost" 
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#b8004e]/10 dark:bg-pink-500/10 text-[#b8004e] dark:text-pink-400 font-bold transition-all text-sm my-2"
                >
                  <i className='bx bx-edit-alt text-lg'></i>
                  <span>Write Post</span>
                </NavLink>

                <div className="h-px bg-gray-100 dark:bg-zinc-800/50 my-2"></div>

                <Link
                  to={`/profile/${userInfo?.username}`}
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/40 text-gray-700 dark:text-zinc-300 font-bold transition-all text-sm"
                >
                  <i className='bx bx-user text-lg'></i>
                  <span>My Profile</span>
                </Link>

                <button 
                  onClick={() => { setDrawerOpen(false); handleLogoutClick(); }} 
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 font-bold transition-all text-sm text-left w-full"
                >
                  <i className='bx bx-log-out text-lg'></i>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <NavLink 
                to="/login" 
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/40 text-gray-700 dark:text-zinc-300 font-bold transition-all text-sm"
              >
                <i className='bx bx-log-in text-lg'></i>
                <span>Login</span>
              </NavLink>
            )}
          </div>
        </div>
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
    </>
  )
}

export default Navbar
