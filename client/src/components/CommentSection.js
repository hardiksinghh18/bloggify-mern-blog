import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../features/auth/authSlice';
import defaultProfile from '../images/defaultProfile.jpg'
import LoadingButton from '@mui/lab/LoadingButton';
import { BsArrowReturnRight } from "react-icons/bs";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import SendIcon from '@mui/icons-material/Send';
import { useGetCommentsQuery, useAddCommentMutation, useDeleteCommentMutation, useToggleLikeCommentMutation } from '../features/comments/commentsApiSlice';

const CommentSection = ({ singleBlogId, blogAuthorId, blogAuthorImage }) => {
    const userInfo = useSelector(selectUserInfo);

    const [newComment, setNewComment] = useState('');
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [visibleReplies, setVisibleReplies] = useState({});

    const { data: allComments = [] } = useGetCommentsQuery();
    const [addComment, { isLoading: commentLoading }] = useAddCommentMutation();
    const [deleteCommentApi] = useDeleteCommentMutation();
    const [toggleLikeCommentApi] = useToggleLikeCommentMutation();

    const blogComments = allComments?.filter((item) => {
        return item.blogId === singleBlogId
    })

    const topLevelComments = blogComments?.filter(item => !item.parentCommentId);
    const getReplies = (parentId) => blogComments?.filter(item => item.parentCommentId === parentId);


    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim() === '') return;

        try {
            await addComment({ newComment, singleBlogId }).unwrap();
            toast.success('Comment added successfully.')
            setNewComment('');
            // Reset textarea heights
            document.querySelectorAll('textarea').forEach(t => t.style.height = 'auto');
        } catch (error) {
            console.log(error)
        }
    };

    const handleReplySubmit = async (e, parentId) => {
        e.preventDefault();
        if (replyText.trim() === '') return;

        try {
            await addComment({ newComment: replyText, singleBlogId, parentCommentId: parentId }).unwrap();
            toast.success('Reply added successfully.')
            setReplyText('');
            setActiveReplyId(null);
            document.querySelectorAll('textarea').forEach(t => t.style.height = 'auto');
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

    const toggleReplies = (commentId) => {
        setVisibleReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    };

    const toggleLike = async (commentId) => {
        if (userInfo?._id !== blogAuthorId && userInfo?._id) return; // Only author can like/unlike
        try {
            await toggleLikeCommentApi({ commentId }).unwrap();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="w-full  mx-auto my-8">
            {/* Comment form */}
            <form onSubmit={handleCommentSubmit} className="w-full flex items-center gap-2 border border-gray-700/60 rounded-md p-2 mb-8 bg-transparent">
                <textarea
                    className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 resize-none text-sm overflow-y-auto custom-scrollbar"
                    rows={1}
                    placeholder="Write your comment here..."
                    value={newComment}
                    onChange={(e) => {
                        setNewComment(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
                    }}
                />
                <LoadingButton
                    loading={commentLoading}
                    type="submit"
                    sx={{ minWidth: "auto", p: 1, color: "gray", "&:hover": { color: "#3b82f6" }, alignSelf: "flex-end" }}
                >
                    <SendIcon fontSize="small" />
                </LoadingButton>
            </form>

            {/* Display comments */}

            <div className='mt-8 '>
                {topLevelComments && topLevelComments.map((comment, index) => {
                    return (


                        <div key={index} className="rounded-md py-2  flex">

                            <a href={`/profile/${comment?.userId?._id}/${comment?.userId?.name}`} className='flex items-start justify-center pt-3'>
                                <img

                                    src={comment?.userId?.profileImage ? comment?.userId?.profileImage : defaultProfile}
                                    alt="Profile"
                                    className="h-8 w-8 mr-4 rounded-full  "
                                />

                            </a>
                            <div className="flex flex-col items-start mt-2  mx-0 w-full relative">
                                <div className="flex items-center gap-2">
                                    <a href={`/profile/${comment?.userId?._id}/${comment?.userId?.name}`} className="text-xs text-gray-500 font-bold">{comment?.username}</a>

                                    <div className="cursor-pointer flex items-center" onClick={() => toggleLike(comment?._id)}>
                                        {comment?.isLikedByAuthor ? (
                                            <div className="relative inline-block w-4 h-4 ml-1">
                                                <img src={blogAuthorImage || defaultProfile} alt="Author" className="w-full h-full rounded-full object-cover" />
                                                <FaHeart className="text-red-500 absolute -bottom-[2px] -right-[2px]" style={{ fontSize: '10px' }} />
                                            </div>
                                        ) : (
                                            (userInfo?._id === blogAuthorId) ? <FaRegHeart className="text-gray-500 text-sm hover:text-red-500 ml-1" /> : null
                                        )}
                                    </div>
                                </div>

                                <p className="text-sm flex font-semibold mt-1 w-[90%]">{comment?.commentDesc}</p>

                                <div className="flex gap-4 mt-1">
                                    <button onClick={() => setActiveReplyId(activeReplyId === comment?._id ? null : comment?._id)} className='text-xs font-semibold text-gray-500 hover:text-gray-700'>
                                        Reply
                                    </button>
                                    {(userInfo?._id === comment?.userId?._id) ? (<button onClick={() => deleteComment(comment?._id)} className='text-xs font-semibold text-gray-500 hover:text-red-500'>Delete</button>) : ('')}
                                </div>

                                {activeReplyId === comment?._id && (
                                    <form onSubmit={(e) => handleReplySubmit(e, comment?._id)} className="w-full mt-3 flex items-center gap-2 border border-gray-700/60 rounded-md p-2">
                                        <textarea
                                            className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 resize-none text-sm overflow-y-auto custom-scrollbar"
                                            rows={1}
                                            placeholder="Write a reply..."
                                            value={replyText}
                                            onChange={(e) => {
                                                setReplyText(e.target.value);
                                                e.target.style.height = 'auto';
                                                e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
                                            }}
                                        />
                                        <LoadingButton
                                            loading={commentLoading}
                                            type="submit"
                                            sx={{ minWidth: "auto", p: 1, color: "gray", "&:hover": { color: "#3b82f6" }, alignSelf: "flex-end" }}
                                        >
                                            <SendIcon fontSize="small" />
                                        </LoadingButton>
                                    </form>
                                )}

                                {getReplies(comment?._id)?.length > 0 && (
                                    <div className="w-full mt-3">
                                        <div
                                            className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-gray-600 text-xs font-semibold mb-2"
                                            onClick={() => toggleReplies(comment?._id)}
                                        >
                                            <div className="w-6 h-[1px] bg-gray-400"></div>
                                            {visibleReplies[comment?._id] ? 'Hide replies' : `View replies (${getReplies(comment?._id).length})`}
                                        </div>

                                        {visibleReplies[comment?._id] && (
                                            <div className="w-full mt-2 pl-4">
                                                {getReplies(comment?._id)?.map((reply, replyIndex) => (
                                                    <div key={replyIndex} className="rounded-md py-2 flex w-full relative">
                                                        <div className="absolute -left-8 top-3 text-gray-500">
                                                            <BsArrowReturnRight size={18} />
                                                        </div>
                                                        <a href={`/profile/${reply?.userId?._id}/${reply?.userId?.name}`} className='flex items-start justify-center pt-1'>
                                                            <img
                                                                src={reply?.userId?.profileImage ? reply?.userId?.profileImage : defaultProfile}
                                                                alt="Profile"
                                                                className="h-6 w-6 mr-3 rounded-full"
                                                            />
                                                        </a>
                                                        <div className="flex flex-col items-start mx-0 w-full relative">
                                                            <div className="flex items-center gap-2">
                                                                <a href={`/profile/${reply?.userId?._id}/${reply?.userId?.name}`} className="text-xs text-gray-500 font-bold">{reply?.username}</a>

                                                                <div className="cursor-pointer flex items-center" onClick={() => toggleLike(reply?._id)}>
                                                                    {reply?.isLikedByAuthor ? (
                                                                        <div className="relative inline-block w-4 h-4 ml-1">
                                                                            <img src={blogAuthorImage || defaultProfile} alt="Author" className="w-full h-full rounded-full object-cover" />
                                                                            <FaHeart className="text-red-500 absolute -bottom-[2px] -right-[2px]" style={{ fontSize: '10px' }} />
                                                                        </div>
                                                                    ) : (
                                                                        (userInfo?._id === blogAuthorId) ? <FaRegHeart className="text-gray-500 text-sm hover:text-red-500 ml-1" /> : null
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <p className="text-sm flex font-semibold mt-1 w-[90%]">{reply?.commentDesc}</p>

                                                            {(userInfo?._id === reply?.userId?._id) && (
                                                                <button onClick={() => deleteComment(reply?._id)} className='text-xs mt-1 text-gray-500 hover:text-red-500 font-semibold'>Delete</button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>




                        </div>
                    )
                })}
            </div>

        </div>
    );
};

export default CommentSection;
