import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../features/auth/authSlice';
import defaultProfile from '../images/defaultProfile.jpg'
import LoadingButton from '@mui/lab/LoadingButton';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useGetCommentsQuery, useAddCommentMutation, useDeleteCommentMutation, useToggleLikeCommentMutation } from '../features/comments/commentsApiSlice';
import { slugify } from '../Utils/slugify'

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
        <div className="w-full mx-auto my-8 bg-gray-50 dark:bg-[#1a1a1a] p-6 md:p-8 rounded-3xl shadow-sm">
            {/* Comment form */}
            <form onSubmit={handleCommentSubmit} className="w-full mb-12 flex flex-col gap-4">
                <div className="flex gap-4 items-start w-full">
                    <img 
                        src={userInfo?.profileImage || defaultProfile} 
                        alt="Your Profile" 
                        className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm"
                    />
                    <textarea
                        className="flex-1 bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-2xl outline-none focus:outline-none focus:ring-0 resize-none text-sm lg:text-base overflow-y-auto custom-scrollbar p-4 shadow-inner"
                        rows={3}
                        placeholder="Write something..."
                        value={newComment}
                        maxLength={500}
                        onChange={(e) => {
                            setNewComment(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                        }}
                    />
                </div>
                <div className="flex justify-end">
                    <LoadingButton
                        loading={commentLoading}
                        variant="contained"
                        type="submit"
                        sx={{ 
                            textTransform: 'none', 
                            borderRadius: '999px', 
                            backgroundColor: '#b8004e', 
                            color: 'white',
                            px: 4,
                            py: 1,
                            fontWeight: 600,
                            "&:hover": { backgroundColor: "#9a0042" }
                        }}
                    >
                        Comment
                    </LoadingButton>
                </div>
            </form>

            {/* Display comments */}

            <div className='mt-8 '>
                {topLevelComments && topLevelComments.map((comment, index) => {
                    return (


                        <div key={index} className="rounded-md py-4 flex w-full border-b border-gray-100 dark:border-gray-800/50 mt-2 mb-2 pb-6 last:border-0">
                            <a href={`/profile/${comment?.userId?._id}/${slugify(comment?.userId?.name)}`} className='relative flex items-start justify-center pt-1 shrink-0 z-10'>
                                <img
                                    src={comment?.userId?.profileImage ? comment?.userId?.profileImage : defaultProfile}
                                    alt="Profile"
                                    className="h-10 w-10 mr-4 rounded-full object-cover shadow-sm bg-gray-50 dark:bg-[#1a1a1a]"
                                />
                            </a>
                            <div className="flex flex-col items-start mx-0 w-full relative">
                                {/* Flawless dynamic track line extending from avatar to bottom toggle button */}
                                {getReplies(comment?._id)?.length > 0 && (
                                    <div className="absolute top-[12px] bottom-[42px] -left-[36px] w-[2px] bg-gray-300 dark:bg-gray-700 z-0 pointer-events-none" />
                                )}
                                <div className="flex items-center justify-between w-full mb-1">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Tooltip title={comment?.username?.length > 15 ? comment?.username : ""} arrow placement="top">
                                            <a href={`/profile/${comment?.userId?._id}/${slugify(comment?.userId?.name)}`} className="text-sm text-gray-500 dark:text-gray-400 font-bold truncate max-w-[120px]">{comment?.username}</a>
                                        </Tooltip>
                                        
                                        {(comment?.isLikedByAuthor || userInfo?._id === blogAuthorId) && (
                                            <div className="cursor-pointer flex items-center transition-colors" onClick={() => toggleLike(comment?._id)}>
                                                {comment?.isLikedByAuthor ? (
                                                    <div className="relative inline-block w-[18px] h-[18px]">
                                                        <img src={blogAuthorImage || defaultProfile} alt="Author" className="w-full h-full rounded-full object-cover shadow-sm" />
                                                        <FaHeart className="text-red-500 absolute -bottom-[3px] -right-[3px]" style={{ fontSize: '10px' }} />
                                                    </div>
                                                ) : (
                                                    <FaRegHeart className="text-gray-400 text-[13px] hover:text-red-500 transition-colors" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <p className="text-[15px] leading-relaxed text-gray-900 dark:text-gray-100 font-semibold mt-1 w-[95%]">{comment?.commentDesc}</p>

                                <div className="flex items-center gap-6 mt-2">

                                    <button onClick={() => setActiveReplyId(activeReplyId === comment?._id ? null : comment?._id)} className='flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors'>
                                         Reply
                                    </button>
                                    
                                    {(userInfo?._id === comment?.userId?._id) ? (
                                        <button onClick={() => deleteComment(comment?._id)} className='text-xs font-bold text-gray-400 hover:text-red-500 transition-colors ml-2'>Delete</button>
                                    ) : null}
                                </div>

                                {activeReplyId === comment?._id && (
                                    <form onSubmit={(e) => handleReplySubmit(e, comment?._id)} className="w-full mt-4 flex items-center gap-4 bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-4 shadow-sm">
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
                                            sx={{ minWidth: "auto", p: 1, backgroundColor: '#b8004e', color: "white", "&:hover": { backgroundColor: "#9a0042" }, borderRadius: '999px' }}
                                        >
                                            <SendIcon fontSize="small" />
                                        </LoadingButton>
                                    </form>
                                )}

                                {getReplies(comment?._id)?.length > 0 && (
                                    <div className="w-full mt-2">
                                        {!visibleReplies[comment?._id] ? (
                                            <div className="w-full relative pt-2 pb-1">
                                                <div className="absolute top-0 -left-[36px] w-[50px] h-[24px] rounded-bl-[16px] border-l-[2px] border-b-[2px] border-transparent border-l-gray-300 border-b-gray-300 dark:border-l-gray-700 dark:border-b-gray-700 pointer-events-none z-10" />
                                                <div
                                                    className="flex items-center cursor-pointer text-[#065fd4] dark:text-[#3ea6ff] text-[13px] font-bold hover:bg-blue-500/10 px-4 py-2 w-max rounded-full transition-colors relative z-20 bg-gray-50 dark:bg-[#1a1a1a]"
                                                    onClick={() => toggleReplies(comment?._id)}
                                                >
                                                    <span className="mr-2">▿</span> {getReplies(comment?._id).length} replies
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full mt-3 flex flex-col relative">
                                                
                                                {[...(getReplies(comment?._id) || [])].reverse().map((reply, replyIndex) => {
                                                    return (
                                                        <div key={replyIndex} className="rounded-md flex w-full relative pt-2 pb-2">
                                                            {/* Branch curve into this individual reply */}
                                                            <div className="absolute top-0 -left-[36px] w-[36px] h-[20px] rounded-bl-[16px] border-l-[2px] border-b-[2px] border-transparent border-l-gray-300 border-b-gray-300 dark:border-l-gray-700 dark:border-b-gray-700 pointer-events-none z-0" />
                                                            
                                                            <a href={`/profile/${reply?.userId?._id}/${slugify(reply?.userId?.name)}`} className='relative flex items-start justify-center shrink-0 z-10'>
                                                                <img
                                                                    src={reply?.userId?.profileImage ? reply?.userId?.profileImage : defaultProfile}
                                                                    alt="Profile"
                                                                    className="h-6 w-6 mr-3 rounded-full object-cover shadow-sm bg-gray-50 dark:bg-[#1a1a1a]"
                                                                />
                                                            </a>
                                                            <div className="flex flex-col items-start mx-0 w-full relative">
                                                                <div className="flex items-center justify-between w-full mb-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <a href={`/profile/${reply?.userId?._id}/${slugify(reply?.userId?.name)}`} className="text-[13px] text-gray-500 dark:text-gray-400 font-bold">{reply?.username}</a>
                                                                        {(reply?.isLikedByAuthor || userInfo?._id === blogAuthorId) && (
                                                                            <div className="cursor-pointer flex items-center transition-colors" onClick={() => toggleLike(reply?._id)}>
                                                                                {reply?.isLikedByAuthor ? (
                                                                                    <div className="relative inline-block w-[16px] h-[16px]">
                                                                                        <img src={blogAuthorImage || defaultProfile} alt="Author" className="w-full h-full rounded-full object-cover shadow-sm" />
                                                                                        <FaHeart className="text-red-500 absolute -bottom-[3px] -right-[3px]" style={{ fontSize: '9px' }} />
                                                                                    </div>
                                                                                ) : (
                                                                                    <FaRegHeart className="text-gray-400 text-[12px] hover:text-red-500 transition-colors" />
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <p className="text-[14px] leading-relaxed text-gray-900 dark:text-gray-100 font-semibold mt-0.5 w-[95%]">{reply?.commentDesc}</p>
                                                                
                                                                <div className="flex items-center gap-6 mt-1">

                                                                    {(userInfo?._id === reply?.userId?._id) && (
                                                                        <button onClick={() => deleteComment(reply?._id)} className='text-xs text-gray-400 hover:text-red-500 font-bold transition-colors'>Delete</button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                                
                                                <div className="w-full relative pt-2 pb-1 mt-1">
                                                    <div className="absolute top-0 -left-[36px] w-[50px] h-[24px] rounded-bl-[16px] border-l-[2px] border-b-[2px] border-transparent border-l-gray-300 border-b-gray-300 dark:border-l-gray-700 dark:border-b-gray-700 pointer-events-none z-10" />
                                                    <div
                                                        className="flex items-center cursor-pointer text-[#065fd4] dark:text-[#3ea6ff] text-[13px] font-bold hover:bg-blue-500/10 px-4 py-2 w-max rounded-full transition-colors relative z-20 bg-gray-50 dark:bg-[#1a1a1a]"
                                                        onClick={() => toggleReplies(comment?._id)}
                                                    >
                                                        <span className="mr-2">▵</span> Hide replies
                                                    </div>
                                                </div>
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
