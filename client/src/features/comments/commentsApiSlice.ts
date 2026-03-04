import { apiSlice } from '../api/apiSlice';

interface Comment {
    _id: string;
    username: string;
    userId: {
        _id: string;
        name: string;
        profileImage?: string;
    };
    commentDesc: string;
    blogId: string;
    createdAt: string;
}

interface AddCommentRequest {
    newComment: string;
    singleBlogId: string;
}

export const commentsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getComments: builder.query<Comment[], void>({
            query: () => '/comment',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'Comment' as const, id: _id })),
                        { type: 'Comment', id: 'LIST' },
                    ]
                    : [{ type: 'Comment', id: 'LIST' }],
        }),

        addComment: builder.mutation<{ status: string }, AddCommentRequest>({
            query: (commentData) => ({
                url: '/comment',
                method: 'POST',
                body: commentData,
            }),
            invalidatesTags: [{ type: 'Comment', id: 'LIST' }],
        }),

        deleteComment: builder.mutation<{ message: string }, { deleteCommentId: string }>({
            query: ({ deleteCommentId }) => ({
                url: '/deletecomment',
                method: 'POST',
                body: { deleteCommentId },
            }),
            invalidatesTags: [{ type: 'Comment', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetCommentsQuery,
    useAddCommentMutation,
    useDeleteCommentMutation,
} = commentsApiSlice;
