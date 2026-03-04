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

        getUserProfile: builder.mutation<UserProfile, { id: string }>({
            query: (userId) => ({
                url: '/profile',
                method: 'POST',
                body: userId,
            }),
        }),

        updateBio: builder.mutation<{ message: string }, UpdateBioRequest>({
            query: (newData) => ({
                url: '/updatebio',
                method: 'POST',
                body: newData,
            }),
            invalidatesTags: ['User'],
        }),

        uploadProfileImage: builder.mutation<{ profileUrl: string }, FormData>({
            query: (formData) => ({
                url: '/profileimage',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useCheckProfileAuthQuery,
    useGetUserProfileMutation,
    useUpdateBioMutation,
    useUploadProfileImageMutation,
} = userApiSlice;
