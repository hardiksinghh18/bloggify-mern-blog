import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useBlogContext } from '../context/BlogContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import defaultProfile from '../images/defaultProfile.jpg'
import { useAuthContext } from '../context/userContext'
import CommentSection from '../components/CommentSection'
import EditBlog from '../components/EditBlog'
import LoadingSkeleton from '../components/LoadingSkeletons/LoadingSkeleton'
import BlogLoadingSkeleton from '../components/LoadingSkeletons/BlogLoadingSkeleton'


const SingleBlog = () => {
  axios.defaults.withCredentials = true;
  const { userInfo, isAuthenticated, setIsAuthenticated } = useAuthContext()
  const [blogDetail, setBlogDetail] = useState()
  const { blogsData } = useBlogContext();
  const navigate = useNavigate()
  const { id } = useParams()
  const [editable, setEditable] = useState(false);
  const [loading,setLoading]=useState(true)




  const singleBlogDetail = blogsData && blogsData?.filter((blog) => {
    
    return blog._id === id
  })


  const handleEdit = () => {
    // setNewTitle(singleBlogDetail[0]?.title)
    setEditable(!editable)
  }


  const profileImageUrl = singleBlogDetail[0]?.author?.profileImage ? singleBlogDetail[0]?.author?.profileImage : defaultProfile

  const date = new Date(singleBlogDetail[0]?.createdAt)
  const formattedDate = date.toDateString();


  const fetchData = async () => {
    try {
      const res = await axios.get('https://bloggify-jet.vercel.app/singleblog')

      if (res?.data?.valid) {
        setIsAuthenticated(res?.data?.valid)
        setLoading(false)
      } else {
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const increaseViewCount = async () => {
    const res = await axios.post('https://bloggify-jet.vercel.app/views', { id })
  }
  useEffect(() => {

    fetchData()
    increaseViewCount()
  }, [])


if(loading){
  return(
    <BlogLoadingSkeleton/>
  )
}

  return (
    <div >
      {!editable ? (
        <div>

          <div className=' px-4 lg:px-64 py-4 lg:py-8 flex flex-col items-center justify-center w-full'>

            <div><h2 className=' lg:my-2 sm:text-2xl md:text-3xl lg:text-4xl font-bold'>{singleBlogDetail[0]?.title}</h2></div>



            <div className='flex justify-between w-full items-center'>
              <div className='flex my-8  justify-start gap-2 items-center'>
                <a href={`/profile/${singleBlogDetail[0]?.author?._id}/${singleBlogDetail[0]?.author?.name}`}>
                  <img className='h-10 sm:h-12 rounded-full mr-2' src={profileImageUrl} alt="" />
                </a>
                <div className='text-[.75rem] sm:text-sm'>
                  <a href={`/profile/${singleBlogDetail[0]?.author?._id}/${singleBlogDetail[0]?.author?.name}`} >{singleBlogDetail[0]?.author?.name}</a>
                  {formattedDate && <p>{formattedDate}</p>}
                </div>
              </div>

              <div className='flex  lg:mx-2 items-center justify-center gap-4 '>
                <div className='flex flex-col items-center justify-center  '>
                  <p className=''>{singleBlogDetail[0]?.views} </p>
                  <p className='text-xs'>Views</p>

                </div>
                <div className='flex flex-col items-center justify-center  '>
                  <a href='#comments'><i className='bx bx-chat '></i></a>
                  <p className='text-xs'>Comments</p>
                </div>
                {(!editable && (singleBlogDetail[0]?.author?._id === userInfo?._id)) ? (
                  <div className='flex flex-col items-center justify-center  '>
                    <button onClick={handleEdit} className=''><i className='bx bxs-pencil mx-1'></i></button>
                    <p className='text-xs'>Edit</p>
                  </div>
                ) : ('')}


              </div>
            </div>
            <div className='blogContent '>

              <div className='h-96 overflow-hidden ' >
                <img className='w-full h-full object-cover ' src={singleBlogDetail[0]?.coverImage} alt="" />
              </div>
              <div>
                <p className=' mt-8 text-sm'><i>Summary : {singleBlogDetail[0]?.summary}</i></p>
              </div>
              <div className='my-8 text-sm' dangerouslySetInnerHTML={{ __html: singleBlogDetail[0]?.content }} />
            </div>
          </div>

          <div id='comments' className="comment_section w-full px-4 lg:px-64   my-8 ">
            <h1 className='font-bold text-sm sm:text-lg lg:text-xl'>Commments</h1>
            <CommentSection singleBlogId={singleBlogDetail[0]?._id} />
          </div>
        </div>
      ) : (

        <EditBlog editable={editable} setEditable={setEditable} handleEdit={handleEdit} singleBlog={singleBlogDetail[0]} />
      )}
    </div>
  )
}

export default SingleBlog
