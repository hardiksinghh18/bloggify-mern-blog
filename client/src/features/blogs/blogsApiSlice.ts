import { apiSlice } from '../api/apiSlice';

interface Blog {
    _id: string;
    title: string;
    summary: string;
    content: string;
    coverImage: string;
    views: number;
    likes?: string[];
    dislikes?: string[];
    createdAt: string;
    author: {
        _id: string;
        name: string;
        email: string;
        profileImage?: string;
    };
}

interface TrendingBlog extends Blog {
    trendingScore: number;
    commentsCount: number;
}

interface TrendingBlogsResponse {
    trendingBlogs: TrendingBlog[];
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
    totalBlogs: number;
    message: string;
}

interface PublicBlogsResponse {
    allBlogs: Blog[];
    totalBlogs: number;
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

interface PaginationParams {
    page?: number;
    limit?: number;
}

interface SingleBlogResponse {
    blog: Blog;
    moreFromAuthor: Blog[];
    valid: boolean;
}

export const blogsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboard: builder.query<DashboardResponse, PaginationParams | void>({
            query: (params) => {
                const p = params && 'page' in params ? params.page : 1;
                const l = params && 'limit' in params ? params.limit : 10;
                return `/dashboard?page=${p}&limit=${l}`;
            },
            providesTags: (result) =>
                result?.allBlogs
                    ? [
                        ...result.allBlogs.map(({ _id }) => ({ type: 'Blog' as const, id: _id })),
                        { type: 'Blog', id: 'LIST' },
                        'Auth',
                    ]
                    : [{ type: 'Blog', id: 'LIST' }, 'Auth'],
        }),

        getPublicBlogs: builder.query<PublicBlogsResponse, PaginationParams | void>({
            query: (params) => {
                const p = params && 'page' in params ? params.page : 1;
                const l = params && 'limit' in params ? params.limit : 10;
                return `/blogs?page=${p}&limit=${l}`;
            },
            providesTags: (result) =>
                result?.allBlogs
                    ? [
                        ...result.allBlogs.map(({ _id }) => ({ type: 'Blog' as const, id: _id })),
                        { type: 'Blog', id: 'LIST' },
                    ]
                    : [{ type: 'Blog', id: 'LIST' }],
        }),

        getTrendingBlogs: builder.query<TrendingBlogsResponse, number | void>({
            query: (limit) => `/trending${limit ? `?limit=${limit}` : ''}`,
            providesTags: [{ type: 'Blog', id: 'LIST' }],
        }),

        checkNewPostAuth: builder.query<AuthCheckResponse, void>({
            query: () => '/newpost',
        }),

        getSingleBlog: builder.query<SingleBlogResponse, string>({
            query: (id) => `/blog/${id}`,
            providesTags: (result, error, id) => [{ type: 'Blog', id }],
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

        likeBlog: builder.mutation<{ message: string, likes: string[], dislikes: string[] }, { blogId: string }>({
            query: ({ blogId }) => ({
                url: '/likeblog',
                method: 'POST',
                body: { blogId },
            }),
            invalidatesTags: ['Blog'],
        }),

        dislikeBlog: builder.mutation<{ message: string, likes: string[], dislikes: string[] }, { blogId: string }>({
            query: ({ blogId }) => ({
                url: '/dislikeblog',
                method: 'POST',
                body: { blogId },
            }),
            invalidatesTags: ['Blog'],
        }),
    }),
});

export const {
    useGetDashboardQuery,
    useGetPublicBlogsQuery,
    useGetTrendingBlogsQuery,
    useCheckNewPostAuthQuery,
    useGetSingleBlogQuery,
    useCreatePostMutation,
    useEditBlogMutation,
    useDeleteBlogMutation,
    useIncrementViewsMutation,
    useLikeBlogMutation,
    useDislikeBlogMutation,
} = blogsApiSlice;
