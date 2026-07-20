import { apiSlice } from '../api/apiSlice';

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAdminStats: builder.query<{ usersCount: number; blogsCount: number; commentsCount: number }, void>({
            query: () => '/admin/stats',
            providesTags: ['User', 'Blog', 'Comment'],
        }),
        getAdminUsers: builder.query<{ users: any[] }, void>({
            query: () => '/admin/users',
            providesTags: ['User'],
        }),
        updateUserRole: builder.mutation<any, { id: string; role: string }>({
            query: ({ id, role }) => ({
                url: `/admin/users/${id}/role`,
                method: 'PUT',
                body: { role },
            }),
            invalidatesTags: ['User'],
        }),
        deleteUser: builder.mutation<any, string>({
            query: (id) => ({
                url: `/admin/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User', 'Blog', 'Comment'],
        }),
        getAdminBlogs: builder.query<{ blogs: any[] }, void>({
            query: () => '/admin/blogs',
            providesTags: ['Blog'],
        }),
        deleteBlogByAdmin: builder.mutation<any, { id: string; reason: string }>({
            query: ({ id, reason }) => ({
                url: `/admin/blogs/${id}`,
                method: 'DELETE',
                body: { reason },
            }),
            invalidatesTags: ['Blog', 'Comment'],
        }),
        getAdminComments: builder.query<{ comments: any[] }, void>({
            query: () => '/admin/comments',
            providesTags: ['Comment'],
        }),
        deleteCommentByAdmin: builder.mutation<any, { id: string; reason: string }>({
            query: ({ id, reason }) => ({
                url: `/admin/comments/${id}`,
                method: 'DELETE',
                body: { reason },
            }),
            invalidatesTags: ['Comment'],
        }),
    }),
});

export const {
    useGetAdminStatsQuery,
    useGetAdminUsersQuery,
    useUpdateUserRoleMutation,
    useDeleteUserMutation,
    useGetAdminBlogsQuery,
    useDeleteBlogByAdminMutation,
    useGetAdminCommentsQuery,
    useDeleteCommentByAdminMutation,
} = adminApiSlice;
