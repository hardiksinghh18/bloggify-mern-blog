import { apiSlice } from '../api/apiSlice';

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    bio?: string;
    profileImage?: string;
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

        getUserProfile: builder.query<UserProfile, { id: string }>({
            query: (userId) => ({
                url: '/profile',
                method: 'POST',
                body: userId,
            }),
            providesTags: (_result, _error, arg) => [{ type: 'User', id: arg.id }],
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
    }),
});

export const {
    useCheckProfileAuthQuery,
    useGetUserProfileQuery,
    useUpdateBioMutation,
    useUploadProfileImageMutation,
} = userApiSlice;
