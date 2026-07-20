import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Select,
    MenuItem,
    FormControl
} from '@mui/material';
import {
    useGetAdminStatsQuery,
    useGetAdminUsersQuery,
    useUpdateUserRoleMutation,
    useDeleteUserMutation,
    useGetAdminBlogsQuery,
    useDeleteBlogByAdminMutation,
    useGetAdminCommentsQuery,
    useDeleteCommentByAdminMutation,
} from '../features/admin/adminApiSlice';
import { DELETION_REASONS } from '../Utils/constants';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'blogs' | 'comments'>('overview');
    const [deleteReason, setDeleteReason] = useState<string>(DELETION_REASONS[0]);

    // API queries/mutations
    const { data: statsData, isLoading: statsLoading } = useGetAdminStatsQuery();
    const { data: usersData, isLoading: usersLoading } = useGetAdminUsersQuery();
    const { data: blogsData, isLoading: blogsLoading } = useGetAdminBlogsQuery();
    const { data: commentsData, isLoading: commentsLoading } = useGetAdminCommentsQuery();

    const [updateUserRole] = useUpdateUserRoleMutation();
    const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();
    const [deleteBlog, { isLoading: isDeletingBlog }] = useDeleteBlogByAdminMutation();
    const [deleteComment, { isLoading: isDeletingComment }] = useDeleteCommentByAdminMutation();

    // Dialog state
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [pendingRole, setPendingRole] = useState<{ userId: string; userName: string; currentRole: string; targetRole: string } | null>(null);

    const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
    const [pendingDeleteUser, setPendingDeleteUser] = useState<{ id: string; name: string } | null>(null);

    const [deleteBlogDialogOpen, setDeleteBlogDialogOpen] = useState(false);
    const [pendingDeleteBlog, setPendingDeleteBlog] = useState<{ id: string; title: string } | null>(null);

    const [deleteCommentDialogOpen, setDeleteCommentDialogOpen] = useState(false);
    const [pendingDeleteCommentId, setPendingDeleteCommentId] = useState<string | null>(null);

    // Confirm actions
    const handleRoleChangeConfirm = async () => {
        if (!pendingRole) return;
        try {
            await updateUserRole({ id: pendingRole.userId, role: pendingRole.targetRole }).unwrap();
            toast.success('User role updated successfully');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to update user role');
        } finally {
            setRoleDialogOpen(false);
            setPendingRole(null);
        }
    };

    const handleDeleteUserConfirm = async () => {
        if (!pendingDeleteUser) return;
        try {
            await deleteUser(pendingDeleteUser.id).unwrap();
            toast.success('User and associated content deleted successfully');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to delete user');
        } finally {
            setDeleteUserDialogOpen(false);
            setPendingDeleteUser(null);
        }
    };

    const handleDeleteBlogConfirm = async () => {
        if (!pendingDeleteBlog) return;
        try {
            await deleteBlog({ id: pendingDeleteBlog.id, reason: deleteReason }).unwrap();
            toast.success('Blog deleted successfully');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to delete blog');
        } finally {
            setDeleteBlogDialogOpen(false);
            setPendingDeleteBlog(null);
            setDeleteReason(DELETION_REASONS[0]);
        }
    };

    const handleDeleteCommentConfirm = async () => {
        if (!pendingDeleteCommentId) return;
        try {
            await deleteComment({ id: pendingDeleteCommentId, reason: deleteReason }).unwrap();
            toast.success('Comment deleted successfully');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to delete comment');
        } finally {
            setDeleteCommentDialogOpen(false);
            setPendingDeleteCommentId(null);
            setDeleteReason(DELETION_REASONS[0]);
        }
    };

    const isLoading = statsLoading || usersLoading || blogsLoading || commentsLoading;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b8004e]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    <i className="bx bx-shield-quarter text-4xl text-[#b8004e]"></i>
                    Admin Panel
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
                    Manage users, moderate blog posts, inspect discussion comments, and view application metrics.
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 dark:border-zinc-800 mb-8 overflow-x-auto scrollbar-none gap-2">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${
                        activeTab === 'overview'
                            ? 'border-[#b8004e] text-[#b8004e]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300'
                    }`}
                >
                    <i className="bx bx-analyse text-lg"></i>
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${
                        activeTab === 'users'
                            ? 'border-[#b8004e] text-[#b8004e]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300'
                    }`}
                >
                    <i className="bx bx-group text-lg"></i>
                    Users ({usersData?.users?.length || 0})
                </button>
                <button
                    onClick={() => setActiveTab('blogs')}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${
                        activeTab === 'blogs'
                            ? 'border-[#b8004e] text-[#b8004e]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300'
                    }`}
                >
                    <i className="bx bx-book-open text-lg"></i>
                    Blogs ({blogsData?.blogs?.length || 0})
                </button>
                <button
                    onClick={() => setActiveTab('comments')}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${
                        activeTab === 'comments'
                            ? 'border-[#b8004e] text-[#b8004e]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300'
                    }`}
                >
                    <i className="bx bx-comment-detail text-lg"></i>
                    Comments ({commentsData?.comments?.length || 0})
                </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stat Card 1 */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-[#b8004e]/10 to-[#b8004e]/5 dark:from-pink-500/10 dark:to-transparent border border-[#b8004e]/20 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 dark:text-zinc-400">Total Registered Users</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                                {statsData?.usersCount || 0}
                            </h3>
                        </div>
                        <div className="p-3 bg-[#b8004e]/10 dark:bg-pink-500/10 rounded-2xl">
                            <i className="bx bx-user text-3xl text-[#b8004e] dark:text-pink-400"></i>
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 dark:from-indigo-500/10 dark:to-transparent border border-indigo-500/20 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 dark:text-zinc-400">Total Blog Posts</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                                {statsData?.blogsCount || 0}
                            </h3>
                        </div>
                        <div className="p-3 bg-indigo-500/10 rounded-2xl">
                            <i className="bx bx-book-open text-3xl text-indigo-600 dark:text-indigo-400"></i>
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/10 dark:to-transparent border border-emerald-500/20 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 dark:text-zinc-400">Total Comments</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                                {statsData?.commentsCount || 0}
                            </h3>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-2xl">
                            <i className="bx bx-comment-detail text-3xl text-emerald-600 dark:text-emerald-400"></i>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="bg-white dark:bg-[#121214] border border-gray-150 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 dark:divide-zinc-800">
                            <thead className="bg-gray-50 dark:bg-[#18181b]/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
                                {usersData?.users?.map((user: any) => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/10 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-zinc-800 flex-shrink-0 overflow-hidden border border-gray-100 dark:border-zinc-800">
                                                    {user.profileImage ? (
                                                        <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center font-bold text-gray-500">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</div>
                                                    <div className="text-xs text-gray-400">@{user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-zinc-300">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <FormControl size="small" variant="standard">
                                                <Select
                                                    value={user.role}
                                                    onChange={(e) => {
                                                        const targetVal = e.target.value as string;
                                                        if (targetVal !== user.role) {
                                                            setPendingRole({
                                                                userId: user._id,
                                                                userName: user.name,
                                                                currentRole: user.role,
                                                                targetRole: targetVal
                                                            });
                                                            setRoleDialogOpen(true);
                                                        }
                                                    }}
                                                    disableUnderline
                                                    className={`font-bold text-xs capitalize px-3 py-1 rounded-full border-none focus:outline-none ${
                                                        user.role === 'admin'
                                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 font-bold'
                                                            : 'bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-400'
                                                    }`}
                                                    SelectDisplayProps={{
                                                        style: { paddingRight: '20px', paddingTop: '2px', paddingBottom: '2px' }
                                                    }}
                                                >
                                                    <MenuItem value="user" className="capitalize text-xs font-semibold">User</MenuItem>
                                                    <MenuItem value="admin" className="capitalize text-xs font-semibold">Admin</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => {
                                                        setPendingDeleteUser({ id: user._id, name: user.name });
                                                        setDeleteUserDialogOpen(true);
                                                    }}
                                                    disabled={isDeletingUser}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-bold text-xs bg-red-50 dark:bg-red-500/10 hover:bg-red-100 px-3 py-1.5 rounded-full transition-all flex items-center gap-1"
                                                >
                                                    <i className="bx bx-trash text-xs"></i>
                                                    Delete User
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'blogs' && (
                <div className="bg-white dark:bg-[#121214] border border-gray-150 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 dark:divide-zinc-800">
                            <thead className="bg-gray-50 dark:bg-[#18181b]/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Blog Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Author</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Date Created</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
                                {blogsData?.blogs?.map((blog: any) => (
                                    <tr key={blog._id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/10 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900 dark:text-white max-w-xs truncate">{blog.title}</div>
                                            <div className="text-xs text-gray-400 truncate max-w-xs">/{blog.slug}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-zinc-300">
                                            {blog.author ? (
                                                <div>
                                                    <div className="font-semibold">{blog.author.name}</div>
                                                    <div className="text-xs text-gray-400">@{blog.author.username}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">Unknown Author</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    to={`/blogs/${blog.slug}`}
                                                    className="text-[#b8004e] hover:text-[#9a0042] font-bold text-xs bg-[#b8004e]/10 hover:bg-[#b8004e]/20 px-3 py-1.5 rounded-full transition-all"
                                                >
                                                    View Post
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setPendingDeleteBlog({ id: blog._id, title: blog.title });
                                                        setDeleteBlogDialogOpen(true);
                                                    }}
                                                    disabled={isDeletingBlog}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-bold text-xs bg-red-50 dark:bg-red-500/10 hover:bg-red-100 px-3 py-1.5 rounded-full transition-all flex items-center gap-1"
                                                >
                                                    <i className="bx bx-trash text-xs"></i>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'comments' && (
                <div className="space-y-4">
                    {commentsData?.comments?.map((comment: any) => (
                        <div key={comment._id} className="bg-white dark:bg-[#121214] border border-gray-150 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start sm:items-center justify-between gap-4 mb-2">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
                                    <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px]" title={comment.userId?.name || comment.username}>
                                        {comment.userId?.name || comment.username}
                                    </span>
                                    <span className="text-xs text-gray-400 truncate max-w-[150px]" title={`@${comment.userId?.username || comment.username}`}>
                                        @{comment.userId?.username || comment.username}
                                    </span>
                                    {comment.createdAt && !isNaN(new Date(comment.createdAt).getTime()) && (
                                        <>
                                            <span className="text-[10px] text-gray-400 hidden sm:inline">•</span>
                                            <span className="text-xs text-gray-500 dark:text-zinc-400">
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </span>
                                        </>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        setPendingDeleteCommentId(comment._id);
                                        setDeleteCommentDialogOpen(true);
                                    }}
                                    disabled={isDeletingComment}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-bold text-xs flex items-center gap-1 flex-shrink-0 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 px-3 py-1.5 rounded-full transition-all"
                                >
                                    <i className="bx bx-trash"></i>
                                    Delete
                                </button>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-zinc-300 bg-gray-50 dark:bg-zinc-800/20 rounded-xl p-3 border border-gray-100 dark:border-zinc-800/50">
                                {comment.commentDesc}
                            </p>
                        </div>
                    ))}
                    {commentsData?.comments?.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-zinc-400 font-medium">
                            No comments found on the platform.
                        </div>
                    )}
                </div>
            )}

            {/* CONFIRMATION DIALOGS */}
            
            {/* 1. Change Role Dialog */}
            <Dialog
                open={roleDialogOpen}
                onClose={() => { setRoleDialogOpen(false); setPendingRole(null); }}
                PaperProps={{
                    sx: {
                        borderRadius: '24px',
                        padding: '8px',
                        backgroundColor: 'background.paper',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem' }}>Change User Role</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        Are you sure you want to change <span className="text-gray-900 dark:text-white font-bold">{pendingRole?.userName}</span>'s role from <span className="capitalize font-bold text-[#b8004e]">{pendingRole?.currentRole}</span> to <span className="capitalize font-bold text-indigo-600 dark:text-indigo-400">{pendingRole?.targetRole}</span>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 2 }}>
                    <Button onClick={() => { setRoleDialogOpen(false); setPendingRole(null); }} sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleRoleChangeConfirm} variant="contained" className="bg-[#b8004e] hover:bg-[#9a0042]" sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#b8004e', color: '#ffffff', px: 3 }}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 2. Delete User Dialog */}
            <Dialog
                open={deleteUserDialogOpen}
                onClose={() => { setDeleteUserDialogOpen(false); setPendingDeleteUser(null); }}
                PaperProps={{
                    sx: {
                        borderRadius: '24px',
                        padding: '8px',
                        backgroundColor: 'background.paper',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#dc2626' }}>Delete User Account</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        Warning: Deleting user <span className="text-gray-900 dark:text-white font-bold">"{pendingDeleteUser?.name}"</span> will permanently remove their profile, blogs, and comments. This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 2 }}>
                    <Button onClick={() => { setDeleteUserDialogOpen(false); setPendingDeleteUser(null); }} sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteUserConfirm} variant="contained" className="bg-[#dc2626] hover:bg-[#b91c1c]" sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#dc2626', color: '#ffffff', px: 3 }}>
                        Delete User
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 3. Delete Blog Dialog */}
            <Dialog
                open={deleteBlogDialogOpen}
                onClose={() => { setDeleteBlogDialogOpen(false); setPendingDeleteBlog(null); }}
                PaperProps={{
                    sx: {
                        borderRadius: '24px',
                        padding: '8px',
                        backgroundColor: 'background.paper',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#dc2626' }}>Delete Blog Post</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontWeight: 600, color: 'text.secondary', mb: 2 }}>
                        Are you sure you want to permanently delete the blog <span className="text-gray-900 dark:text-white font-bold">"{pendingDeleteBlog?.title}"</span>?
                    </DialogContentText>
                    <DialogContentText sx={{ fontWeight: 600, color: 'text.secondary', mb: 1, fontSize: '0.875rem' }}>
                        Please select a reason for removal:
                    </DialogContentText>
                    <FormControl fullWidth size="small" variant="outlined" sx={{ mt: 1 }}>
                        <Select
                            value={deleteReason}
                            onChange={(e) => setDeleteReason(e.target.value as string)}
                            sx={{
                                borderRadius: '12px',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                            }}
                        >
                            {DELETION_REASONS.map((reason) => (
                                <MenuItem key={reason} value={reason} sx={{ fontSize: '0.875rem' }}>
                                    {reason}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 2 }}>
                    <Button onClick={() => { setDeleteBlogDialogOpen(false); setPendingDeleteBlog(null); }} sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteBlogConfirm} variant="contained" className="bg-[#dc2626] hover:bg-[#b91c1c]" sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#dc2626', color: '#ffffff', px: 3 }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 4. Delete Comment Dialog */}
            <Dialog
                open={deleteCommentDialogOpen}
                onClose={() => { setDeleteCommentDialogOpen(false); setPendingDeleteCommentId(null); }}
                PaperProps={{
                    sx: {
                        borderRadius: '24px',
                        padding: '8px',
                        backgroundColor: 'background.paper',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#dc2626' }}>Delete Comment</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontWeight: 600, color: 'text.secondary', mb: 2 }}>
                        Are you sure you want to permanently delete this comment?
                    </DialogContentText>
                    <DialogContentText sx={{ fontWeight: 600, color: 'text.secondary', mb: 1, fontSize: '0.875rem' }}>
                        Please select a reason for removal:
                    </DialogContentText>
                    <FormControl fullWidth size="small" variant="outlined" sx={{ mt: 1 }}>
                        <Select
                            value={deleteReason}
                            onChange={(e) => setDeleteReason(e.target.value as string)}
                            sx={{
                                borderRadius: '12px',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                            }}
                        >
                            {DELETION_REASONS.map((reason) => (
                                <MenuItem key={reason} value={reason} sx={{ fontSize: '0.875rem' }}>
                                    {reason}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 2 }}>
                    <Button onClick={() => { setDeleteCommentDialogOpen(false); setPendingDeleteCommentId(null); }} sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteCommentConfirm} variant="contained" className="bg-[#dc2626] hover:bg-[#b91c1c]" sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#dc2626', color: '#ffffff', px: 3 }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AdminDashboard;
