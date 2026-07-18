import { apiSlice } from '../api/apiSlice';

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    username?: string;
    bio?: string;
    profileImage?: string;
    followers?: any[];
    following?: any[];
}

interface AuthCheckResponse {
    valid: boolean;
    message: string;
}

interface UpdateBioRequest {
    newName: string;
    newBio: string;
}

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        checkProfileAuth: builder.query<AuthCheckResponse, void>({
            query: () => '/profile',
        }),

        getUserProfile: builder.query<UserProfile, { username: string }>({
            query: (params) => ({
                url: '/profile',
                method: 'POST',
                body: params,
            }),
            providesTags: (_result, _error, arg) => [{ type: 'User', id: arg.username }],
        }),

        updateBio: builder.mutation<{ message: string }, UpdateBioRequest>({
            query: (newData) => ({
                url: '/updatebio',
                method: 'POST',
                body: newData,
            }),
            invalidatesTags: ['User', 'Blog', 'Auth'],
        }),

        uploadProfileImage: builder.mutation<{ profileUrl: string }, FormData>({
            query: (formData) => ({
                url: '/profileimage',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['User', 'Blog', 'Auth'],
        }),

        followUser: builder.mutation<{ message: string, isFollowing: boolean }, { targetUserId: string }>({
            query: (body) => ({
                url: '/follow',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User', 'Auth'],
        }),
    }),
});

export const {
    useCheckProfileAuthQuery,
    useGetUserProfileQuery,
    useUpdateBioMutation,
    useUploadProfileImageMutation,
    useFollowUserMutation,
} = userApiSlice;
