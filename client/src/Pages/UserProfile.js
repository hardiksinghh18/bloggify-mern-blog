import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import defaultProfile from '../images/defaultProfile.jpg'
import BlogLayoutThree from '../components/Blog/BlogLayoutThree'
import ProfilePictureEditor from '../components/ProfilePictureEditor'
import { toast } from 'react-toastify'
import LoadingSkeleton from '../components/LoadingSkeletons/LoadingSkeleton'
import LoadingButton from '@mui/lab/LoadingButton';
import { useSelector, useDispatch } from 'react-redux'
import { selectUserInfo, setAuthenticated } from '../features/auth/authSlice'
import { useGetDashboardQuery } from '../features/blogs/blogsApiSlice'
import { useCheckProfileAuthQuery, useGetUserProfileQuery, useUpdateBioMutation } from '../features/user/userApiSlice'
import { useDeleteBlogMutation } from '../features/blogs/blogsApiSlice'

const UserProfile = () => {

  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const [newBio, setNewBio] = useState('')
  const [newName, setNewName] = useState('')
  const [editable, setEditable] = useState(false)

  const navigate = useNavigate()
  const userId = useParams()
  const [isOpen, setIsOpen] = useState(false);

  const { data: authData, isSuccess: authSuccess } = useCheckProfileAuthQuery();
  const { data: dashboardData } = useGetDashboardQuery();
  const { data: userProfile, isLoading: profileLoading } = useGetUserProfileQuery({ id: userId?.id });
  const [updateBio, { isLoading: saveLoading }] = useUpdateBioMutation();
  const [deleteBlogApi] = useDeleteBlogMutation();

  const blogsData = dashboardData?.allBlogs;

  const profileImageUrl = userProfile?.profileImage ? userProfile?.profileImage : defaultProfile;

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const handleEdit = () => {
    setEditable(true)
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

  const deleteBlog = async (blogId) => {
    const confirm = window.confirm('Delete this Blog permanently ?')
    if (confirm) {
      try {
        await deleteBlogApi({ blogId }).unwrap();
        toast.success('Blog deleted successfully')
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    if (authSuccess) {
      if (authData?.valid) {
        dispatch(setAuthenticated(true));
      } else {
        navigate('/login');
      }
    }
  }, [authSuccess, authData, dispatch, navigate]);

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

  const isOwnProfile = userInfo?._id === userId?.id;

  if (profileLoading) {
    return (
      <LoadingSkeleton />
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 pb-8 border-b border-gray-200 dark:border-gray-800">
        
        {/* Avatar */}
        <div className="relative shrink-0">
          {editable ? (
            <div className="relative group cursor-pointer" onClick={toggleModal}>
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover opacity-60 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <i className='bx bx-camera text-3xl opacity-80'></i>
              </div>
            </div>
          ) : (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-gray-100 dark:ring-gray-800"
            />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col items-center sm:items-start gap-2 w-full">
          <div className="flex items-center gap-3 w-full justify-center sm:justify-start">
            {editable ? (
              <input
                type="text"
                value={newName}
                onChange={handleName}
                placeholder={userProfile?.name}
                className="text-2xl sm:text-3xl font-extrabold bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg outline-none px-3 py-2 w-full max-w-md focus:border-gray-500 dark:focus:border-gray-400 transition-colors"
              />
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{userProfile?.name}</h1>
                {(isOwnProfile && !editable) && (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors opacity-70 hover:opacity-100"
                  >
                    <i className='bx bx-edit-alt text-sm'></i>
                    Edit
                  </button>
                )}
              </>
            )}
          </div>

          <p className="text-sm opacity-60">{userProfile?.email}</p>

          {editable ? (
            <textarea
              value={newBio}
              onChange={handleBio}
              placeholder={userProfile?.bio ? userProfile?.bio : 'Tell us about yourself...'}
              rows={3}
              className="text-sm sm:text-base bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg outline-none w-full max-w-lg mt-2 resize-none px-3 py-2 focus:border-gray-500 dark:focus:border-gray-400 transition-colors"
            />
          ) : (
            <p className="text-sm sm:text-base opacity-70 mt-1 max-w-lg">
              {userProfile?.bio || (isOwnProfile ? 'Add a bio to tell the world about yourself ✨' : '')}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-xl sm:text-2xl font-bold">{totalBlogs}</span>
              <span className="text-xs opacity-50 font-medium">Posts</span>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-xl sm:text-2xl font-bold">{totalViews.toLocaleString()}</span>
              <span className="text-xs opacity-50 font-medium">Views</span>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-xl sm:text-2xl font-bold">{totalLikes}</span>
              <span className="text-xs opacity-50 font-medium">Likes</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-4">
            {editable && (
              <>
                <LoadingButton
                  loading={saveLoading}
                  onClick={updateUserProfile}
                  className="btn text-sm font-semibold px-5 py-2.5 rounded-full"
                  sx={{
                    borderRadius: '9999px',
                    textTransform: 'none',
                    fontFamily: 'inherit',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    padding: '10px 20px',
                  }}
                >
                  Save Changes
                </LoadingButton>
                <button
                  onClick={handleCancel}
                  className="text-sm font-semibold px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Profile Picture Editor Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={toggleModal}></div>
          <div className="relative bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 sm:p-8 z-50 max-w-[85vw] sm:max-w-sm shadow-2xl overflow-hidden">
            <button onClick={toggleModal} className='absolute top-4 right-4 hover:cursor-pointer text-2xl opacity-60 hover:opacity-100 transition-opacity'>
              <i className='bx bx-x'></i>
            </button>
            <ProfilePictureEditor profileImageUrl={profileImageUrl} toggleModal={toggleModal} isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>
      )}

      {/* Blogs Section */}
      <div className="mt-8">
        <h2 className="text-lg sm:text-xl font-bold mb-2 border-b border-gray-200 dark:border-gray-800 pb-3">
          {isOwnProfile ? 'Your Posts' : `Posts by ${userProfile?.name}`}
        </h2>

        {(userBlogs && userBlogs.length !== 0) ? (
          <div className="flex flex-col w-full">
            {userBlogs.map((blog) => (
              <div key={blog?._id} className="relative w-full group/item">
                <BlogLayoutThree blog={blog} />
                {isOwnProfile && (
                  <button
                    onClick={() => deleteBlog(blog?._id)}
                    className="absolute top-10 right-0 opacity-0 group-hover/item:opacity-100 transition-opacity text-red-500 hover:text-red-600 p-2"
                    title="Delete this post"
                  >
                    <i className='bx bx-trash text-xl'></i>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 opacity-50">
            <i className='bx bx-notepad text-5xl mb-3'></i>
            <p className="text-sm font-medium">
              {isOwnProfile ? 'You haven\'t posted anything yet. Start writing!' : 'No posts yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile
