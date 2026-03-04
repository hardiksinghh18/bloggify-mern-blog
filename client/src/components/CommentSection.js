import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../features/auth/authSlice';
import { useGetCommentsQuery, useAddCommentMutation, useDeleteCommentMutation } from '../features/comments/commentsApiSlice';
import defaultProfile from '../images/defaultProfile.jpg'
import LoadingButton from '@mui/lab/LoadingButton';

const CommentSection = ({ singleBlogId }) => {
    const userInfo = useSelector(selectUserInfo);

    const [newComment, setNewComment] = useState('');

    const { data: allComments = [] } = useGetCommentsQuery();
    const [addComment, { isLoading: commentLoading }] = useAddCommentMutation();
    const [deleteCommentApi] = useDeleteCommentMutation();

    const blogComments = allComments?.filter((item) => {
        return item.blogId === singleBlogId
    })


    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim() === '') return;

        try {
            await addComment({ newComment, singleBlogId }).unwrap();
            toast.success('Comment added successfully.')
            setNewComment('');
        } catch (error) {
            console.log(error)
        }
    };


    const deleteComment = async (deleteCommentId) => {
        try {
            await deleteCommentApi({ deleteCommentId }).unwrap();
            toast.success('Comment deleted successfully.')
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
                <LoadingButton
                    loading={commentLoading}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md  btn text-xs"
                    type="submit"
                >
                    Post Comment
                </LoadingButton>
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

                                {(userInfo?._id === comment?.userId?._id) ? (<button onClick={() => deleteComment(comment?._id)} className='text-xs  mt-2 '>Delete</button>) : ('')}
                            </div>




                        </div>
                    )
                })}
            </div>

        </div>
    );
};

export default CommentSection;
