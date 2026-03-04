import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import defaultProfile from '../images/defaultProfile.jpg'
import BlogLayoutfour from '../components/Blog/BlogLayoutFour'
import ProfilePictureEditor from '../components/ProfilePictureEditor'
import { toast } from 'react-toastify'
import LoadingSkeleton from '../components/LoadingSkeletons/LoadingSkeleton'
import LoadingButton from '@mui/lab/LoadingButton';
import { useSelector, useDispatch } from 'react-redux'
import { selectUserInfo, setAuthenticated } from '../features/auth/authSlice'
import { useGetDashboardQuery } from '../features/blogs/blogsApiSlice'
import { useCheckProfileAuthQuery, useGetUserProfileMutation, useUpdateBioMutation } from '../features/user/userApiSlice'

const UserProfile = () => {

  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const [userProfile, setUserProfile] = useState('')
  const [newBio, setNewBio] = useState('')
  const [newName, setNewName] = useState('')
  const [saved, setSaved] = useState(false)
  const [editable, setEditable] = useState(false)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const userId = useParams()
  const [isOpen, setIsOpen] = useState(false);

  const { data: authData, isSuccess: authSuccess } = useCheckProfileAuthQuery();
  const { data: dashboardData } = useGetDashboardQuery();
  const [getUserProfile] = useGetUserProfileMutation();
  const [updateBio, { isLoading: saveLoading }] = useUpdateBioMutation();

  const blogsData = dashboardData?.allBlogs;

  const profileImageUrl = userProfile?.profileImage ? userProfile?.profileImage : defaultProfile;

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setSaved(!saved)
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
      setSaved(!saved)
    } catch (error) {
      console.log(error)
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

  const fetchUserDetails = useCallback(async () => {
    try {
      const userData = await getUserProfile(userId).unwrap();
      setUserProfile(userData);
      setNewName(userData?.name);
      setNewBio(userData?.bio);
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }, [getUserProfile, userId])

  useEffect(() => {
    fetchUserDetails()
  }, [saved, isOpen, fetchUserDetails])

  const userBlogs = blogsData?.filter((blog) => {
    return blog?.author?._id === userProfile?._id
  })

  if (loading) {
    return (
      <LoadingSkeleton />
    )
  }

  return (
    <>
      <div className=" mx-auto w-screen flex justify-center   lg:px-16">
        <div className=" rounded-lg  py-6  flex flex-col items-center justify-center  w-[90vw] gap-2 lg:items-start  lg:justify-between lg:flex-row">
          <div className=' relative shadow-md h-fit py-4 px-4 flex flex-col items-start w-[20rem]  lg:w-96 rounded-lg'>
            <div className="flex items-center justify-start w-full ">
              {editable ? (
                <div className='relative flex justify-center items-center'>
                  <img

                    src={profileImageUrl}
                    alt="Profile"
                    className="h-14 w-14 mr-4 rounded-full hover:cursor-pointer opacity-45 "
                  />
                  <div onClick={toggleModal} className='absolute top-3 right-8 text-2xl hover:cursor-pointer'><i className='bx bx-camera'></i></div>
                </div>
              ) : (
                <img

                  src={profileImageUrl}
                  alt="Profile"
                  className="h-14 w-14 mr-4 rounded-full  "
                />
              )}
              <div>
                {editable ? (
                  <div className='text-sm max-w-4'> <input className='p-1 opacity-90 ' type="text" placeholder={userProfile?.name} value={newName} onChange={handleName} /></div>
                ) : (
                  <div>
                    <h2 className="text-sm font-semibold">{userProfile?.name}</h2>
                    <p className=" text-sm">{userProfile?.email}</p>
                  </div>
                )}

              </div>
            </div>
            <div>
              {isOpen && <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                <div className=" relative bg-white rounded-lg pb-8 lg:p-8  z-50 max-w-[80vw]  lg:w-80 ">
                  <p onClick={toggleModal} className='absolute top-4  right-4 hover:cursor-pointer text-2xl '><i className='bx bx-x'></i></p>
                  <ProfilePictureEditor profileImageUrl={profileImageUrl} toggleModal={toggleModal} isOpen={isOpen} setIsOpen={setIsOpen} />
                </div>
              </div>
              }
            </div>
            <div className='my-6'>
              {editable ? (
                <form action="">
                  <textarea type="text" cols={40} rows={10} onChange={handleBio} value={newBio} placeholder={userProfile?.bio ? userProfile?.bio : 'Add bio'} className='p-1 opacity-90 text-sm w-full ' />

                </form>) : (
                <div >
                  <p className='text-sm '>{userProfile?.bio || ''}</p>
                </div>
              )}
            </div>

            {(userInfo?._id === userId?.id && !editable) ? (
              <button className='btn text-[0.6rem] py-2 px-4 rounded-lg font-semibold w-full' onClick={handleEdit} >Edit Profile</button>
            ) : ('')}
            {editable && <div className='flex gap-2 w-full justify-center items-center'>
              <LoadingButton loading={saveLoading} className='btn text-[0.6rem] py-2 px-4 rounded-lg font-semibold' onClick={updateUserProfile} >Save Changes</LoadingButton>
              <button className='btn text-[0.6rem] py-2 px-4 rounded-lg font-semibold' onClick={handleCancel} >Cancel</button>
            </div>
            }
          </div>

          {(userBlogs && userBlogs?.length !== 0) ? (
            <div className=" lg:px-8  flex flex-col  mt-4 items-center sm:items-start  lg:w-[65vw] ">
              <h3 className="text-sm sm:text-lg font-semibold mt-4 sm:mt-0 sm:mb-4 ml-4"> Blogs</h3>
              {userBlogs && userBlogs?.map((blog, index) => {
                return (
                  <div key={blog?._id} className='flex w-screen justify-center sm:justify-start '>
                    <article className=" col-span-2  sxl:col-span-1 row-span-2 relative">
                      <BlogLayoutfour blog={blog} userInfo={userInfo} userId={userId} saved={saved} setSaved={setSaved} />
                    </article>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className=' lg:px-8  flex flex-col  items-start   w-4/5'>No Blogs posted yet</div>
          )}
        </div>
      </div>
    </>
  )
}

export default UserProfile
