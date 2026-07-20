import { apiSlice } from '../api/apiSlice';

export interface NotificationItem {
    _id: string;
    recipient: string;
    title: string;
    message: string;
    reason: string;
    isRead: boolean;
    link?: string;
    type: 'admin_action' | 'follow' | 'like' | 'comment';
    createdAt: string;
    updatedAt: string;
}

export const notificationApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<{ notifications: NotificationItem[] }, void>({
            query: () => '/notifications',
            providesTags: ['Notification'],
        }),
        markNotificationsAsRead: builder.mutation<any, void>({
            query: () => ({
                url: '/notifications/read',
                method: 'PUT',
            }),
            invalidatesTags: ['Notification'],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkNotificationsAsReadMutation,
} = notificationApiSlice;
