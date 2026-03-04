import { apiSlice } from '../api/apiSlice';

interface Blog {
    _id: string;
    title: string;
    summary: string;
    content: string;
    coverImage: string;
    views: number;
    createdAt: string;
    author: {
        _id: string;
        name: string;
        email: string;
        profileImage?: string;
    };
}

interface DashboardResponse {
    valid: boolean;
    user: {
        _id: string;
        name: string;
        email: string;
        bio?: string;
        profileImage?: string;
    };
    allBlogs: Blog[];
    message: string;
}

interface AuthCheckResponse {
    valid: boolean;
    message: string;
}

interface EditBlogRequest {
    newTitle: string;
    newSummary: string;
    newContent: string;
    blogId: string;
}

export const blogsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboard: builder.query<DashboardResponse, void>({
            query: () => '/dashboard',
            providesTags: (result) =>
                result?.allBlogs
                    ? [
                        ...result.allBlogs.map(({ _id }) => ({ type: 'Blog' as const, id: _id })),
                        { type: 'Blog', id: 'LIST' },
                        'Auth',
                    ]
                    : [{ type: 'Blog', id: 'LIST' }, 'Auth'],
        }),

        checkNewPostAuth: builder.query<AuthCheckResponse, void>({
            query: () => '/newpost',
        }),

        checkSingleBlogAuth: builder.query<AuthCheckResponse, void>({
            query: () => '/singleblog',
        }),

        createPost: builder.mutation<AuthCheckResponse, FormData>({
            query: (formData) => ({
                url: '/newpost',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
        }),

        editBlog: builder.mutation<string, EditBlogRequest>({
            query: (updatedData) => ({
                url: '/editblog',
                method: 'POST',
                body: updatedData,
            }),
            invalidatesTags: (_result, _error, arg) => [
                { type: 'Blog', id: arg.blogId },
                { type: 'Blog', id: 'LIST' },
            ],
        }),

        deleteBlog: builder.mutation<{ message: string }, { blogId: string }>({
            query: ({ blogId }) => ({
                url: '/deleteblog',
                method: 'POST',
                body: { blogId },
            }),
            invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
        }),

        incrementViews: builder.mutation<{ message: string }, { id: string }>({
            query: ({ id }) => ({
                url: '/views',
                method: 'POST',
                body: { id },
            }),
        }),
    }),
});

export const {
    useGetDashboardQuery,
    useCheckNewPostAuthQuery,
    useCheckSingleBlogAuthQuery,
    useCreatePostMutation,
    useEditBlogMutation,
    useDeleteBlogMutation,
    useIncrementViewsMutation,
} = blogsApiSlice;
