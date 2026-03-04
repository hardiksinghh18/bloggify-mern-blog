import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify'
import LoadingButton from '@mui/lab/LoadingButton';
import { useEditBlogMutation } from '../features/blogs/blogsApiSlice';

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
        <>

            <div className='w-screen '>

                <div className=" px-4 lg:px-24 py-8 text-sm">
                    <h1 className="text-lg lg:text-2xl font-bold mb-4">Edit Your Blog</h1>
                    <form onSubmit={handleBlogUpdate} encType="multipart/form-data">
                        <div className="mb-4">
                            <label htmlFor="title" className="block    font-bold mb-2">Title:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                placeholder="Enter title for your blog"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="summary" className="block    font-bold mb-2">Summary:</label>
                            <input
                                type="text"
                                id="summary"
                                name="summary"
                                value={newSummary}
                                onChange={(e) => setNewSummary(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                placeholder="Summary of your Blog"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="content" className="block    font-bold mb-2">Content:</label>
                            <ReactQuill
                                id="content"
                                value={newContent}
                                onChange={(e) => setNewContent(e)}
                                required
                                className=" border rounded-md"
                                placeholder="Write your blog content here..."
                            />
                        </div>

                        <LoadingButton loading={saveLoading} type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md btn hover:bg-blue-600 transition duration-300">Save Changes</LoadingButton>
                        <button onClick={handleEdit} className="ml-4 text-black-500 hover:underline">Cancel</button>
                    </form>
                </div>
            </div>

        </>
    )
}

export default EditBlog
