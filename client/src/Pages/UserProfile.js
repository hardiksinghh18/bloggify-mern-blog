import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getProfileImage } from '../Utils'
import BlogLayoutThree from '../components/Blog/BlogLayoutThree'
import ProfilePictureEditor from '../components/ProfilePictureEditor'
import { Tooltip } from '@mui/material'
import Button from '@mui/lab/LoadingButton'
import { toast } from 'react-toastify'
import LoadingButton from '@mui/lab/LoadingButton';
import GhostPost from '../components/GhostPost'
import LoadingSkeleton from '../components/LoadingSkeletons/LoadingSkeleton'
import { selectUserInfo, setAuthenticated } from '../features/auth/authSlice'
import { useGetDashboardQuery } from '../features/blogs/blogsApiSlice'
import { useCheckProfileAuthQuery, useGetUserProfileQuery, useUpdateBioMutation, useFollowUserMutation } from '../features/user/userApiSlice'
import useShareProfile from '../hooks/useShareProfile'
import defaultProfile from '../images/defaultProfile.jpg'


const UserProfile = () => {

  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const [newBio, setNewBio] = useState('')
  const [newName, setNewName] = useState('')
  const [editable, setEditable] = useState(false)
  const { username } = useParams()
  const [isOpen, setIsOpen] = useState(false);

  const { data: authData, isSuccess: authSuccess, isLoading: authLoading } = useCheckProfileAuthQuery();
  const { data: dashboardData } = useGetDashboardQuery();
  const { data: userProfile, isLoading: profileLoading } = useGetUserProfileQuery({ username });
  const [updateBio, { isLoading: saveLoading }] = useUpdateBioMutation();
  const [followUser, { isLoading: followLoading }] = useFollowUserMutation();

  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'followers', 'following'
  const [gearSpinning, setGearSpinning] = useState(false);
  const shareProfile = useShareProfile();

  const blogsData = dashboardData?.allBlogs;

  const profileImageUrl = getProfileImage(userProfile?.profileImage, defaultProfile);
  console.log('user profile', profileImageUrl)

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const handleEdit = () => {
    setGearSpinning(true)
    setTimeout(() => {
      setGearSpinning(false)
      setEditable(true)
    }, 100)
  }

  const handleName = (e) => {
    e.preventDefault()
    setNewName(e.target.value)
  }

  const handleBio = (e) => {
    e.preventDefault()
    setNewBio(e.target.value)
  }
  const handleCancel = () => {
    setNewName(userProfile?.name)
    setNewBio(userProfile?.bio)
    setEditable(!editable)
  }

  const updateUserProfile = async (e) => {
    const newData = {
      newName: newName ? newName : userProfile?.name,
      newBio: newBio ? newBio : userProfile?.bio
    }

    try {
      await updateBio(newData).unwrap();
      setEditable(false)
      toast.success('Profile updated successfully !')
    } catch (error) {
      console.log(error)
    }
  }


  const handleFollow = async (targetId) => {
    try {
      const res = await followUser({ targetUserId: targetId || userProfile?._id }).unwrap();
      toast.success(res?.message);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update follow status');
    }
  };

  // Sync auth state when logged in; guests can still view the page
  useEffect(() => {
    if (authSuccess && authData?.valid) {
      dispatch(setAuthenticated(true));
    }
  }, [authSuccess, authData, dispatch]);

  const isLoggedIn = authData?.valid === true;

  // Sync form state when profile data loads or changes
  useEffect(() => {
    if (userProfile) {
      setNewName(userProfile.name);
      setNewBio(userProfile.bio || '');
    }
  }, [userProfile]);

  const userBlogs = blogsData?.filter((blog) => {
    return blog?.author?._id === userProfile?._id
  })

  // Compute stats
  const totalBlogs = userBlogs?.length || 0;
  const totalViews = userBlogs?.reduce((sum, blog) => sum + (blog?.views || 0), 0) || 0;
  const totalLikes = userBlogs?.reduce((sum, blog) => sum + (blog?.likes?.length || 0), 0) || 0;
  const followersCount = userProfile?.followers?.length || 0;
  const followingCount = userProfile?.following?.length || 0;

  const isOwnProfile = userInfo?._id === userProfile?._id;
  const isFollowingProfile = userProfile?.followers?.some(follower =>
    follower._id === userInfo?._id || follower === userInfo?._id
  );

  const UserListItem = ({ user }) => {
    const isMe = user._id === userInfo?._id;
    const isFollowingThisUser = userProfile?.following?.some(f => f._id === user._id) || false; // Simple check, might need better logic if lists grow

    return (
      <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors rounded-2xl group">
        <Link to={`/profile/${user.username}`} className="flex items-center gap-4 flex-1">
          <img
            src={getProfileImage(user.profileImage, defaultProfile)}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800 group-hover:ring-[#b8004e]/30 transition-all"
          />
          <div className="flex flex-col">
            <span className="font-bold text-base group-hover:text-[#b8004e] transition-colors">{user.name}</span>
            <span className="text-xs opacity-50">View Profile</span>
          </div>
        </Link>

        {!isMe && (
          <button
            onClick={() => handleFollow(user._id)}
            className={`text-xs font-bold px-4 py-1.5 rounded-lg border transition-all ${isFollowingThisUser
              ? "border-gray-200 dark:border-gray-800 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
              : "bg-[#b8004e] text-white border-transparent hover:bg-[#9a0042] shadow-sm"
              }`}
          >
            {isFollowingThisUser ? 'Following' : 'Follow'}
          </button>
        )}
      </div>
    );
  };

  if (profileLoading || authLoading) {
    return (
      <LoadingSkeleton />
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">

      {/* Profile Header */}
      <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 pb-10">

        {/* Avatar */}
        <div className="relative shrink-0">
          {editable ? (
            <div className="relative group cursor-pointer" onClick={toggleModal}>
              <img
                src={profileImageUrl}
                alt="Profile"
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover opacity-60 transition-opacity ring-4 ring-blue-500/20"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <i className='bx bx-camera text-3xl opacity-80'></i>
              </div>
            </div>
          ) : (
            <img
              src={profileImageUrl}
              alt="Profile"
              referrerPolicy="no-referrer"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-gray-100 dark:ring-gray-800 shadow-xl"
            />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col items-center sm:items-start gap-2 w-full">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full justify-center sm:justify-start">
            {editable ? (
              <input
                type="text"
                value={newName}
                onChange={handleName}
                placeholder={userProfile?.name}
                maxLength={30}
                className="text-sm sm:text-base font-semibold bg-transparent border border-gray-300 dark:border-gray-600 rounded-xl outline-none px-4 py-2.5 w-full max-w-md focus:border-blue-500 transition-colors text-center sm:text-left"
              />
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center sm:text-left">{userProfile?.name}</h1>
                {isLoggedIn && isOwnProfile ? (
                  !editable && (
                    /* Gear + Share side by side */
                    <div className="absolute top-0 right-0 sm:static flex items-center gap-1">
                      <Tooltip title="Settings" arrow placement="top">
                        <button
                          onClick={handleEdit}
                          className="p-1.5 opacity-60 hover:opacity-100 transition-opacity"
                        >
                          <i className={`bx bx-cog text-xl${gearSpinning ? ' gear-spin' : ''}`}></i>
                        </button>
                      </Tooltip>
                      <Tooltip title="Share profile" arrow placement="top">
                        <button
                          onClick={() => shareProfile(userProfile)}
                          className="p-1.5 opacity-60 hover:opacity-100 transition-opacity"
                        >
                          <i className="bx bx-share-alt text-xl"></i>
                        </button>
                      </Tooltip>
                    </div>
                  )
                ) : isLoggedIn && !isOwnProfile ? (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <LoadingButton
                      loading={followLoading}
                      onClick={() => handleFollow(userProfile?._id)}
                      variant="outlined"
                      className="text-xs font-bold rounded-full transition-all px-10 py-2.5 w-full sm:w-auto"
                      sx={{
                        borderRadius: '9999px',
                        textTransform: 'none',
                        fontFamily: 'inherit',
                        fontWeight: 700,
                        width: { xs: '100%', sm: 'auto' },
                        transition: 'all 0.3s ease',
                        ...(isFollowingProfile ? {
                          bgcolor: 'rgba(184, 0, 78, 0.08)',
                          borderColor: 'rgba(184, 0, 78, 0.2)',
                          color: '#b8004e',
                          '&:hover': {
                            bgcolor: 'rgba(184, 0, 78, 0.15)',
                            borderColor: 'rgba(184, 0, 78, 0.3)',
                            color: '#b8004e'
                          }
                        } : {
                          bgcolor: 'transparent',
                          borderColor: '#b8004e',
                          color: '#b8004e',
                          '&:hover': {
                            bgcolor: '#b8004e',
                            color: '#fff',
                            borderColor: '#b8004e'
                          }
                        })
                      }}
                    >
                      {isFollowingProfile ? 'Following' : 'Follow'}
                    </LoadingButton>
                    <Tooltip title="Share profile" arrow placement="top">
                      <button
                        onClick={() => shareProfile(userProfile)}
                        className="absolute top-0 right-0 sm:static p-1.5 opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <i className="bx bx-share-alt text-xl"></i>
                      </button>
                    </Tooltip>
                  </div>
                ) : (
                  /* Guest — Follow redirects to login, share always works */
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      to="/login"
                      className="text-xs font-bold px-8 py-2.5 rounded-full border border-[#b8004e] text-[#b8004e] hover:bg-[#b8004e] hover:text-white transition-all duration-300 w-full sm:w-auto text-center"
                    >
                      Follow
                    </Link>
                    <Tooltip title="Share profile" arrow placement="top">
                      <button
                        onClick={() => shareProfile(userProfile)}
                        className="absolute top-0 right-0 sm:static p-1.5 opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <i className="bx bx-share-alt text-xl"></i>
                      </button>
                    </Tooltip>
                  </div>
                )}
              </>
            )}
          </div>

          {editable ? (
            <input
              type="email"
              value={userProfile?.email}
              disabled
              className="text-sm font-medium bg-gray-50 dark:bg-white/[0.03] border border-gray-300 dark:border-gray-600 rounded-xl outline-none px-4 py-2 w-full max-w-md opacity-60 cursor-not-allowed mt-2"
            />
          ) : (
            <p className="text-sm font-medium opacity-50">{userProfile?.email}</p>
          )}

          {editable ? (
            <textarea
              value={newBio}
              onChange={handleBio}
              placeholder={userProfile?.bio ? userProfile?.bio : 'Tell us about yourself...'}
              rows={3}
              maxLength={150}
              className="text-sm sm:text-base bg-transparent border border-gray-300 dark:border-gray-600 rounded-xl outline-none w-full max-w-md mt-2 resize-none px-4 py-2 focus:border-blue-500 transition-colors"
            />
          ) : (
            <p className="text-sm sm:text-base opacity-70 mt-1 max-w-lg leading-relaxed">
              {userProfile?.bio || (isOwnProfile ? 'Add a bio to tell the world about yourself ✨' : '')}
            </p>
          )}

          {/* Detailed Stats Row — logged-in only */}
          {isLoggedIn && !editable && (
            <div className="flex items-center justify-center sm:justify-start gap-8 mt-6 w-full">
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-lg font-bold italic opacity-40 uppercase tracking-widest text-[10px] mb-0.5">Reach</span>
                <span className="text-xl font-black">{totalViews.toLocaleString()}</span>
              </div>
              <div className="w-px h-8 bg-gray-100 dark:bg-gray-800"></div>
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-lg font-bold italic opacity-40 uppercase tracking-widest text-[10px] mb-0.5">Appreciation</span>
                <span className="text-xl font-black">{totalLikes}</span>
              </div>
            </div>
          )}

          {isLoggedIn && editable && (
            <div className="flex items-center justify-end gap-3 mt-6 w-full max-w-md">
              <Button
                variant='outlined'
                onClick={handleCancel}
                className="text-sm font-bold px-6 py-2 transition-colors"
                sx={{
                  color: '#b8004e',
                  borderColor: 'rgba(184, 0, 78, 0.5)',
                  textTransform: 'none',
                  fontFamily: 'inherit',
                  '&:hover': {
                    borderColor: '#b8004e',
                    color: '#9a0042',
                    backgroundColor: 'rgba(184, 0, 78, 0.04)'
                  }
                }}
              >
                Cancel
              </Button>
              <LoadingButton
                loading={saveLoading}
                onClick={updateUserProfile}
                variant="contained"
                className="bg-[#b8004e] text-white hover:bg-[#9a0042] transition-colors px-6 py-2.5 rounded-md shadow-sm text-sm"
                sx={{
                  textTransform: 'none',
                  fontFamily: 'inherit',
                  fontWeight: 700,
                  bgcolor: '#b8004e',
                  color: '#ffffff',
                  '&:hover': { bgcolor: '#9a0042' }
                }}
              >
                Save
              </LoadingButton>
            </div>
          )}
        </div>
      </div>



      {/* Guest — ghost post with lock overlay */}
      {!isLoggedIn && (
        <div className="relative mt-6 min-h-[280px] px-2 py-4">
          {/* Frosted blur overlay */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 rounded-2xl overflow-hidden text-center">
            <div className="absolute inset-0 backdrop-blur-[6px]" />
            {/* Content floats directly on blur — no card */}
            <div
              className="lock-pulse relative z-10 w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(184,0,78,0.10)', border: '1.5px solid rgba(184,0,78,0.22)' }}
            >
              <i className="bx bx-lock-alt text-4xl text-[#b8004e]"></i>
            </div>
            <div className="relative z-10 flex flex-col gap-1">
              <p className="text-base font-extrabold tracking-tight">Login to view content</p>
              <p className="text-[11px] opacity-60 leading-relaxed">
                Sign in to explore posts,<br />followers &amp; following
              </p>
            </div>
            <Link
              to="/login"
              className="relative z-10 inline-flex items-center gap-2 text-white text-sm font-bold px-7 py-2.5 rounded-full transition-all duration-300 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #b8004e 0%, #e0005e 100%)',
                boxShadow: '0 4px 20px rgba(184,0,78,0.40), 0 1px 0 rgba(255,255,255,0.2) inset',
              }}
            >
              <i className="bx bx-log-in text-base"></i>
              Login
            </Link>
          </div>
          {/* Ghost post underneath the blur */}
          <GhostPost />
        </div>
      )}


      {isLoggedIn && (
        <>
          {/* Tabs Switcher */}
          <div className="flex items-center justify-start gap-12 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 pt-4 pb-2 border-t-2 transition-all uppercase tracking-widest text-[11px] font-bold ${activeTab === 'posts'
                ? "border-black dark:border-white text-black dark:text-white"
                : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
            >
              <i className={`bx ${activeTab === 'posts' ? 'bxs-grid-alt' : 'bx-grid-alt'} text-lg sm:text-sm`}></i>
              <span className="inline text-[9px] sm:text-[11px]">Posts ({totalBlogs})</span>
            </button>
            <button
              onClick={() => setActiveTab('followers')}
              className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 pt-4 pb-2 border-t-2 transition-all uppercase tracking-widest text-[11px] font-bold ${activeTab === 'followers'
                ? "border-black dark:border-white text-black dark:text-white"
                : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
            >
              <i className={`bx ${activeTab === 'followers' ? 'bxs-group' : 'bx-group'} text-lg sm:text-sm`}></i>
              <span className="inline text-[9px] sm:text-[11px]">Followers ({followersCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 pt-4 pb-2 border-t-2 transition-all uppercase tracking-widest text-[11px] font-bold ${activeTab === 'following'
                ? "border-black dark:border-white text-black dark:text-white"
                : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
            >
              <i className={`bx ${activeTab === 'following' ? 'bxs-user-plus' : 'bx-user-plus'} text-lg sm:text-sm`}></i>
              <span className="inline text-[9px] sm:text-[11px]">Following ({followingCount})</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-4 min-h-[400px]">
            {activeTab === 'posts' && (
              <>
                {(userBlogs && userBlogs.length !== 0) ? (
                  <div className="flex flex-col w-full">
                    {userBlogs.map((blog) => (
                      <div key={blog?._id} className="relative w-full group/item px-2">
                        <BlogLayoutThree blog={blog} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 opacity-30 w-full">
                    <i className='bx bx-notepad text-6xl mb-4'></i>
                    <p className="text-sm font-bold uppercase tracking-widest">No posts yet</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'followers' && (
              <>
                {userProfile?.followers && userProfile.followers.length > 0 ? (
                  <div className="max-w-xl flex flex-col gap-1">
                    {userProfile.followers.map(user => <UserListItem key={user._id} user={user} />)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 opacity-30 w-full">
                    <i className='bx bx-group text-6xl mb-4'></i>
                    <p className="text-sm font-bold uppercase tracking-widest">No followers yet</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'following' && (
              <>
                {userProfile?.following && userProfile.following.length > 0 ? (
                  <div className="max-w-xl flex flex-col gap-1">
                    {userProfile.following.map(user => <UserListItem key={user._id} user={user} />)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 opacity-30 w-full">
                    <i className='bx bx-user-plus text-6xl mb-4'></i>
                    <p className="text-sm font-bold uppercase tracking-widest">Not following anyone yet</p>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* Profile Picture Editor Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={toggleModal}></div>
          <div className="relative bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 z-50 max-w-[90vw] sm:max-w-sm shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
            <button onClick={toggleModal} className='absolute top-5 right-5 hover:cursor-pointer text-2xl opacity-60 hover:opacity-100 transition-opacity'>
              <i className='bx bx-x'></i>
            </button>
            <ProfilePictureEditor profileImageUrl={profileImageUrl} toggleModal={toggleModal} isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfile
