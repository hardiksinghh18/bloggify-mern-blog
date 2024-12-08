import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthContext } from '../context/userContext';
import defaultProfile from '../images/defaultProfile.jpg'
const CommentSection = ({ singleBlogId }) => {
    const { userInfo } = useAuthContext()
 
    const [newComment, setNewComment] = useState('');
    const [allComments, setAllComments] = useState([])
    const [load, setLoad] = useState(true)

    const getComments = async () => {
        const comments = await axios.get(`${process.env.REACT_APP_BASE_URL}/comment`)

        setAllComments(comments?.data);
    }

    const blogComments = allComments?.filter((item) => {

        return item.blogId === singleBlogId
    })


    useEffect(() => {
        getComments();
    }, [load])


    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim() === '') return;

        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/comment`, { newComment, singleBlogId })
            toast.success('Comment added successfully.')

            setNewComment('');

        } catch (error) {
            console.log(error)
        }
        setLoad(!load)
    };


    const deleteComment = async (deleteCommentId) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/deletecomment`, { deleteCommentId })
            toast.success('Comment deleted successfully.')
            setLoad(!load)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="w-full  mx-auto my-8">
            {/* Comment form */}
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    className="w-full border rounded-md p-2 mb-2"
                    placeholder="Write your comment here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md  btn text-xs"
                    type="submit"
                >
                    Post Comment
                </button>
            </form>

            {/* Display comments */}

            <div className='mt-8 '>
                {blogComments && blogComments.map((comment, index) => {
                    return (


                        <div key={index} className="rounded-md py-2  flex">

                            <a href={`/profile/${comment?.userId?._id}/${comment?.userId?.name}`} className='flex items-start justify-center pt-3'>
                                <img

                                    src={comment?.userId?.profileImage ? comment?.userId?.profileImage : defaultProfile}
                                    alt="Profile"
                                    className="h-8 w-8 mr-4 rounded-full  "
                                />

                            </a>
                            <div className="flex flex-col items-start mt-2  mx-0">
                                <a href={`/profile/${comment?.userId?._id}/${comment?.userId?.name}`} className=" text-xs ">{comment?.username}</a>

                              <p className=" text-sm flex  font-semibold  ">{comment?.commentDesc}</p>

                            {(userInfo?._id === comment?.userId?._id)? (<button onClick={() => deleteComment(comment?._id)} className='text-xs  mt-2 '>Delete</button>) : ('')}
                            </div>




                        </div>
                    )
                })}
            </div>

        </div>
    );
};

export default CommentSection;


