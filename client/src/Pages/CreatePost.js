import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingButton from '@mui/lab/LoadingButton';
import { useCheckNewPostAuthQuery, useCreatePostMutation } from '../features/blogs/blogsApiSlice';
import { quillModules, quillFormats } from '../Utils/quillConfig';
import { validateBlogForm } from '../Utils/formValidation';

const CreatePost = () => {

  const navigate = useNavigate()
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const { data: authData, isSuccess: authSuccess } = useCheckNewPostAuthQuery();
  const [createPost, { isLoading: submitLoading }] = useCreatePostMutation();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (authSuccess && !authData?.valid) {
      navigate('/login');
    }
  }, [authSuccess, authData, navigate]);


  const handleTitle = (e) => {
    setTitle(e.target.value)
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: null }));
    }
  }
  const handleSummary = (e) => {
    setSummary(e.target.value)
    if (errors.summary) {
      setErrors(prev => ({ ...prev, summary: null }));
    }
  }
  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (errors.file) {
      setErrors(prev => ({ ...prev, file: null }));
    }
  }

  const handleContentChange = (value) => {
    setContent(value);
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: null }));
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()

    const { isValid, errors: validationErrors } = validateBlogForm({ title, summary, content, file, isEdit: false });
    if (!isValid) {
      setErrors(validationErrors);
      // Toast the first error
      const firstError = Object.values(validationErrors)[0];
      toast.error(firstError);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('content', content);

    try {
      const res = await createPost(formData).unwrap();
      if (res?.valid) {
        toast.success('Posted new Blog successfully.')
        navigate('/blogs')
      } else {
        toast.error('Please fill all the required fields')
      }
    } catch (error) {
      toast.error('Please fill all the fields')
      console.log(error)
    }
  }


  return (
    <div className='w-full min-h-screen bg-[#F8F9FA] dark:bg-[#121212] pb-20 transition-colors'>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <form onSubmit={handleSubmit} encType="multipart/form-data">

          <button 
            type="button"
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold opacity-60 hover:opacity-100 hover:text-[#b8004e] transition-all mb-6 self-start"
          >
            <i className='bx bx-arrow-back text-lg'></i>
            <span>Back</span>
          </button>

          {/* Cover Photo Upload */}
          <div className="mb-12">
            <label htmlFor="file" className="relative w-full h-[300px] bg-[#EFEFF3] dark:bg-gray-800 rounded-2xl flex flex-col justify-center items-center cursor-pointer overflow-hidden border-2 border-dashed border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm">
              {file ? (
                <img src={URL.createObjectURL(file)} alt="Cover Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center">
                  <div className="bg-[#E2E4F0] dark:bg-gray-700 p-4 rounded-full mb-4 transition-colors">
                    <svg className="w-8 h-8 text-[#5A63A5] dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                    </svg>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 font-bold mb-1 text-lg">Tap to add cover image</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Recommended size: 1600x900px</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Max file size: 2MB (JPEG, JPG, PNG, WEBP)</p>
                </div>
              )}
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFile}
                className="hidden"
              />
            </label>
            {errors.file && (
              <p className="text-xs font-semibold text-red-500 mt-2 flex items-center gap-1">
                <i className='bx bx-error-circle text-base'></i> {errors.file}
              </p>
            )}
          </div>

          {/* Article Title */}
          <div className="mb-8">
            <label htmlFor="title" className="block text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-2 uppercase">Article Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleTitle}
              maxLength={100}
              className="w-full text-4xl lg:text-5xl font-extrabold bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-300 dark:placeholder-gray-600 text-gray-900 dark:text-white transition-colors"
              placeholder="Enter a captivating title..."
            />
            <div className="flex justify-between items-center mt-2">
              <div>
                {errors.title && (
                  <p className="text-xs font-semibold text-red-500 flex items-center gap-1">
                    <i className='bx bx-error-circle text-base'></i> {errors.title}
                  </p>
                )}
              </div>
              <span className="text-[10px] font-bold tracking-wider select-none text-gray-400 dark:text-gray-500">
                {title.length}/100
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-10">
            <label htmlFor="summary" className="block text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-2 uppercase">Summary</label>
            <textarea
              id="summary"
              name="summary"
              value={summary}
              onChange={handleSummary}
              maxLength={300}
              rows="3"
              className="w-full text-lg px-6 py-5 bg-white dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 resize-none shadow-sm text-gray-900 dark:text-gray-200 transition-colors"
              placeholder="Write a brief overview of your article..."
            ></textarea>
            <div className="flex justify-between items-center mt-2">
              <div>
                {errors.summary && (
                  <p className="text-xs font-semibold text-red-500 flex items-center gap-1">
                    <i className='bx bx-error-circle text-base'></i> {errors.summary}
                  </p>
                )}
              </div>
              <span className="text-[10px] font-bold tracking-wider select-none text-gray-400 dark:text-gray-500">
                {summary.length}/300
              </span>
            </div>
          </div>

          {/* Content ReactQuill */}
          <div className="mb-8">
            <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-2 uppercase">Content</span>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
              <ReactQuill
                id="content"
                value={content}
                onChange={handleContentChange}
                modules={quillModules}
                formats={quillFormats}
                theme="snow"
                className="border-none ql-custom-wrapper text-gray-900 dark:text-gray-200 dark:placeholder-gray-500"
                placeholder="Start writing your masterpiece here..."
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <div>
                {errors.content && (
                  <p className="text-xs font-semibold text-red-500 flex items-center gap-1">
                    <i className='bx bx-error-circle text-base'></i> {errors.content}
                  </p>
                )}
              </div>
              <span className="text-[10px] font-bold tracking-wider select-none text-gray-400 dark:text-gray-500">
                {content ? content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length : 0} words
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end items-center gap-4 mt-8">
            <Link 
              to="/" 
              className="text-gray-500 dark:text-gray-400 font-semibold hover:text-gray-800 dark:hover:text-white transition text-sm"
            >
              Cancel
            </Link>
            <LoadingButton
              loading={submitLoading}
              variant="contained"
              type="submit"
              sx={{
                textTransform: 'none',
                borderRadius: '999px',
                backgroundColor: 'rgba(184, 0, 78, 0.12) !important',
                color: '#b8004e !important',
                px: 4,
                py: 1,
                fontWeight: 600,
                fontSize: '0.875rem',
                boxShadow: 'none !important',
                transition: 'all 0.2s ease',
                "&:hover": { 
                  backgroundColor: "rgba(184, 0, 78, 0.2) !important",
                  boxShadow: 'none !important'
                },
                "&.Mui-disabled": {
                  backgroundColor: 'rgba(184, 0, 78, 0.05) !important',
                  color: 'rgba(184, 0, 78, 0.3) !important'
                }
              }}
            >
              Publish
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
