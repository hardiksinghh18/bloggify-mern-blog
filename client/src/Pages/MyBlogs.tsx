import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserInfo } from '../features/auth/authSlice'
import { useGetDashboardQuery, useDeleteBlogMutation } from '../features/blogs/blogsApiSlice'
// @ts-ignore
import defaultProfile from '../images/defaultProfile.jpg'
import { toast } from 'react-toastify'
import LoadingSkeleton from '../components/LoadingSkeletons/LoadingSkeleton'
import { Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'

const MyBlogs: React.FC = () => {
  const navigate = useNavigate()
  const userInfo = useSelector(selectUserInfo)
  const { data: dashboardData, isLoading } = useGetDashboardQuery({ page: 1, limit: 100 })
  const [deleteBlogApi] = useDeleteBlogMutation()

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null)

  const blogsData = dashboardData?.allBlogs
  const myBlogs = blogsData?.filter((blog: any) => blog?.author?._id === userInfo?._id) || []

  const handleDeleteClick = (blogId: string) => {
    setBlogToDelete(blogId)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false)
    setBlogToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (blogToDelete) {
      try {
        await deleteBlogApi({ blogId: blogToDelete }).unwrap()
        toast.success('Blog deleted successfully')
      } catch (error) {
        console.error(error)
        toast.error('Failed to delete blog')
      } finally {
        setDeleteConfirmOpen(false)
        setBlogToDelete(null)
      }
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-zinc-800/80 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Manage Blogs</h1>
            <p className="text-sm opacity-60 mt-1">Manage and track performance of your published stories.</p>
          </div>
          <Link
            to="/newpost"
            className="flex items-center gap-1.5 text-[13px] font-bold bg-[#b8004e] hover:bg-[#9a0042] text-white px-5 py-2.5 rounded-full transition-all duration-300 transform active:scale-95 shadow-sm"
          >
            <i className="bx bx-plus text-base"></i>
            <span>Write New Story</span>
          </Link>
        </div>

        {/* Content Table / List */}
        {myBlogs.length > 0 ? (
          <div className="bg-white dark:bg-[#18181b] border border-gray-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/20 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                    <th className="py-4 px-6">Story</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-center">Stats</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150/60 dark:divide-zinc-800/60">
                  {myBlogs.map((blog: any) => {
                    const createdDate = blog?.createdAt 
                      ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                      : 'Unknown Date'

                    return (
                      <tr key={blog?._id} className="hover:bg-gray-50/30 dark:hover:bg-zinc-800/10 transition-colors">
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-4">
                            <img
                              src={blog?.coverImage || defaultProfile}
                              alt="Cover"
                              className="w-16 h-10 object-cover rounded-lg border border-gray-100 dark:border-zinc-800 shrink-0"
                            />
                            <div className="flex flex-col min-w-0">
                              <Link
                                to={`/blogs/${blog?.slug}`}
                                className="font-bold text-sm sm:text-base hover:text-[#b8004e] transition-colors truncate max-w-[320px]"
                              >
                                {blog?.title}
                              </Link>
                              <span className="text-xs opacity-50 mt-0.5">Published on {createdDate}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6 vertical-middle">
                          <span className="inline-flex items-center gap-1 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            Published
                          </span>
                        </td>
                        <td className="py-5 px-6 text-center vertical-middle">
                          <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500 dark:text-zinc-400">
                            <div className="flex items-center gap-1" title="Views">
                              <i className="bx bx-show text-base"></i>
                              <span>{blog?.views || 0}</span>
                            </div>
                            <div className="flex items-center gap-1" title="Likes">
                              <i className="bx bx-like text-base"></i>
                              <span>{blog?.likes?.length || 0}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-right vertical-middle">
                          <div className="flex items-center justify-end gap-2.5">
                            <Tooltip title="Edit Story" arrow placement="top">
                              <button
                                onClick={() => navigate(`/blogs/${blog?.slug}?edit=true`)}
                                className="p-2 rounded-xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-150/50 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:text-[#b8004e] dark:hover:text-pink-400 transition-colors shadow-sm"
                              >
                                <i className="bx bx-edit text-lg"></i>
                              </button>
                            </Tooltip>
                            <Tooltip title="Delete Story" arrow placement="top">
                              <button
                                onClick={() => handleDeleteClick(blog?._id)}
                                className="p-2 rounded-xl border border-gray-100 dark:border-zinc-800 hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-600 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 transition-colors shadow-sm"
                              >
                                <i className="bx bx-trash text-lg"></i>
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl">
            <i className="bx bx-book text-5xl opacity-30"></i>
            <h3 className="text-lg font-bold mt-4">No stories yet</h3>
            <p className="text-sm opacity-55 mt-1 max-w-sm mx-auto">
              You haven't written any blogs. Share your ideas with the world!
            </p>
            <Link
              to="/newpost"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold bg-[#b8004e] hover:bg-[#9a0042] text-white px-5 py-2.5 rounded-full transition-all shadow-sm"
            >
              Write Your First Story
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          className: "rounded-2xl dark:bg-[#18181b] border border-gray-100 dark:border-zinc-800",
          style: { borderRadius: '16px' }
        }}
      >
        <DialogTitle id="delete-dialog-title" className="font-bold text-gray-900 dark:text-white pt-6 px-6">
          Delete Story?
        </DialogTitle>
        <DialogContent className="px-6 pb-4">
          <DialogContentText id="delete-dialog-description" className="text-sm text-gray-500 dark:text-zinc-400 font-normal leading-relaxed">
            Are you sure you want to permanently delete this story? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="px-6 pb-6 gap-2">
          <Button 
            onClick={handleDeleteCancel}
            className="font-bold text-sm text-gray-500 hover:text-gray-800 dark:text-zinc-400 dark:hover:text-white"
            sx={{ textTransform: 'none', fontFamily: 'inherit', fontWeight: 700 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete}
            variant="contained"
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-5 py-2.5 rounded-full"
            sx={{ textTransform: 'none', fontFamily: 'inherit', fontWeight: 700, borderRadius: '9999px', bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' } }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default MyBlogs
