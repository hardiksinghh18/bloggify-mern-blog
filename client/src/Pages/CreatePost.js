import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ReactQuill from 'react-quill'; // Import React Quill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import Navbar from '../components/Navbar'
import { useAuthContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreatePost = () => {

  const navigate = useNavigate()
  // const{userInfo,setUserInfo,isAuthenticated}=useAuthContext()
  const [isAuthenticated, setIsAuthenticated] = useState()
  const [userDetails, setUserDetails] = useState()
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  axios.defaults.withCredentials = true;


  const fetchData = async () => {

    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/newpost`)

      if (res?.data?.valid) {

        setIsAuthenticated(res?.data?.valid)

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


  const handleTitle = (e) => {
    setTitle(e.target.value)
  }
  const handleSummary = (e) => {
    setSummary(e.target.value)
  }
  const handleFile = (e) => {
    setFile(e.target.files[0])
  }

  const handleContentChange = (value) => {
    setContent(value);
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('content', content);
    // console.log(file)
    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/newpost`, formData)
      if (res?.data?.valid) {
        toast.success('Posted new Blog successfully.')
      } else {
        toast.error('Please fill all the required fields')
      }
      // console.log(res.data)
    } catch (error) {
      toast.error('Please fill all the fields')
      console.log(error)
    }
    navigate('/blogs')
  }


  return (
    <>

      <div className='w-screen '>

        <div className=" px-4 lg:px-24 py-8 text-sm">
          <h1 className="text-lg lg:text-2xl font-bold mb-4">Add New Blog</h1>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-4">
              <label htmlFor="title" className="block   font-bold mb-2">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={handleTitle}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter title for your blog"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="summary" className="block  font-bold mb-2">Summary:</label>
              <input
                type="text"
                id="summary"
                name="summary"
                value={summary}
                onChange={handleSummary}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Summary of your Blog"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="block font-bold mb-2">
                Content:
              </label>
              <ReactQuill
                id="content"
                value={content}
                onChange={handleContentChange}
                required
                className="border rounded-md"
                placeholder="Write your blog content here..."
              />
            </div>
            <div className="mb-4">
              <label htmlFor="file" className="block   font-bold mb-2">Upload file:</label>
              <input
                type="file"
                id="file"
                name="file"
                // accept="file/*"
                required
                onChange={handleFile}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">Submit</button>
            <Link to="/" className="ml-4 text-blue-500 hover:underline">Cancel</Link>
          </form>
        </div>
      </div>

    </>
  )
}

export default CreatePost
