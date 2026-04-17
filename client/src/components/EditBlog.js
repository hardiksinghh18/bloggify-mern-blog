import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify'
import LoadingButton from '@mui/lab/LoadingButton';
import { useEditBlogMutation } from '../features/blogs/blogsApiSlice';
import { quillModules, quillFormats } from '../Utils/quillConfig';

const EditBlog = ({ singleBlog, editable, setEditable, handleEdit }) => {
    const [newTitle, setNewTitle] = useState(singleBlog?.title);
    const [newSummary, setNewSummary] = useState(singleBlog?.summary);
    const [newContent, setNewContent] = useState(singleBlog?.content);

    const [editBlog, { isLoading: saveLoading }] = useEditBlogMutation();

    const handleBlogUpdate = async (e) => {
        e.preventDefault();
        const updatedData = {
            newTitle, newSummary, newContent, blogId: singleBlog._id
        }

        try {
            await editBlog(updatedData).unwrap();
            toast.success('Blog updated successfully !');
            setEditable(false);

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='w-full min-h-screen bg-[#F8F9FA] dark:bg-[#121212] pb-20 transition-colors'>
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
                <form onSubmit={handleBlogUpdate} encType="multipart/form-data">
                    
                    {/* Cover Photo Upload (UI Mockup) */}
                    <label htmlFor="file" className="relative w-full h-[300px] mb-12 bg-[#EFEFF3] dark:bg-gray-800 rounded-2xl flex flex-col justify-center items-center cursor-pointer overflow-hidden border-2 border-dashed border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm">
                        {singleBlog?.coverImage ? (
                            <img src={singleBlog?.coverImage} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="bg-[#E2E4F0] dark:bg-gray-700 p-4 rounded-full mb-4 transition-colors">
                                    <svg className="w-8 h-8 text-[#5A63A5] dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                                    </svg>
                                </div>
                                <p className="text-gray-800 dark:text-gray-200 font-bold mb-1 text-lg">Tap to add cover photo</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Recommended size: 1600x900px</p>
                            </div>
                        )}
                        <input
                            type="file"
                            id="file"
                            name="file"
                            className="hidden"
                        />
                    </label>

                    {/* Article Title */}
                    <div className="mb-8">
                        <label htmlFor="title" className="block text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-2 uppercase">Article Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            required
                            maxLength={100}
                            className="w-full text-4xl lg:text-5xl font-extrabold bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-300 dark:placeholder-gray-600 text-gray-900 dark:text-white transition-colors"
                            placeholder="Enter a captivating title..."
                        />
                    </div>

                    {/* Executive Summary */}
                    <div className="mb-10">
                        <label htmlFor="summary" className="block text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-2 uppercase">Executive Summary</label>
                        <textarea
                            id="summary"
                            name="summary"
                            value={newSummary}
                            onChange={(e) => setNewSummary(e.target.value)}
                            required
                            maxLength={300}
                            rows="3"
                            className="w-full text-lg px-6 py-5 bg-white dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 resize-none shadow-sm text-gray-900 dark:text-gray-200 transition-colors"
                            placeholder="Write a brief overview of your article..."
                        ></textarea>
                    </div>

                    {/* Content ReactQuill */}
                    <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
                        <ReactQuill
                            id="content"
                            value={newContent}
                            onChange={(e) => setNewContent(e)}
                            modules={quillModules}
                            formats={quillFormats}
                            theme="snow"
                            required
                            className="border-none ql-custom-wrapper text-gray-900 dark:text-gray-200 dark:placeholder-gray-500"
                            placeholder="Start writing your masterpiece here..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end items-center gap-8 mt-8">
                        <button type="button" onClick={handleEdit} className="text-gray-500 dark:text-gray-400 font-medium hover:text-gray-800 dark:hover:text-white transition">
                            Cancel
                        </button>
                        <LoadingButton loading={saveLoading} type="submit" className="bg-[#4F46E5] text-white px-8 font-bold hover:bg-[#4338CA] transition duration-300 shadow-md">
                            Save
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditBlog
