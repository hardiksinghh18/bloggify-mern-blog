import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { useGetNotificationsQuery, useMarkNotificationsAsReadMutation, NotificationItem } from '../features/notifications/notificationApiSlice';

const NotificationBell = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const [notifOpen, setNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const { data: notifData } = useGetNotificationsQuery(undefined, { skip: !isAuthenticated });
    const [markNotificationsAsRead] = useMarkNotificationsAsReadMutation();
    const unreadCount = notifData?.notifications?.filter(n => !n.isRead).length || 0;

    const handleNotifClick = async () => {
        setNotifOpen(!notifOpen);
        if (!notifOpen && unreadCount > 0) {
            try {
                await markNotificationsAsRead().unwrap();
            } catch (err) {
                console.error("Failed to mark notifications as read:", err);
            }
        }
    };

    const getIconClass = (type: string) => {
        switch (type) {
            case 'admin_action':
                return 'bx bx-shield-quarter text-red-600 dark:text-red-400';
            case 'follow':
                return 'bx bx-user-plus text-blue-600 dark:text-blue-400';
            case 'like':
                return 'bx bxs-heart text-pink-600 dark:text-pink-400';
            case 'comment':
                return 'bx bx-comment-detail text-emerald-600 dark:text-emerald-400';
            default:
                return 'bx bx-info-circle text-gray-500';
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="relative flex items-center" ref={notifRef}>
            <button 
                onClick={handleNotifClick}
                className="text-[20px] text-gray-600 dark:text-zinc-300 hover:text-[#b8004e] dark:hover:text-pink-400 transition-all flex items-center hover:scale-110 active:scale-95 duration-200 relative"
            >
                <i className={`bx ${unreadCount > 0 ? 'bx-bell-plus' : 'bx-bell'}`}></i>
                {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-[#18181b] bg-[#b8004e]"></span>
                )}
            </button>

            {notifOpen && (
                <div className="absoluteProfile absolute z-50 flex flex-col p-4 border rounded-2xl top-full right-0 mt-3 w-80 max-h-96 overflow-y-auto bg-white dark:bg-[#1a1a1a] border-gray-100 dark:border-zinc-800/80 shadow-2xl shadow-gray-200/50 dark:shadow-none animate-dropdown-in">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-zinc-800/80 mb-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">Notifications</span>
                        {unreadCount > 0 && (
                            <span className="text-[10px] bg-[#b8004e]/10 text-[#b8004e] px-2 py-0.5 rounded-full font-bold">
                                {unreadCount} New
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        {notifData?.notifications && notifData.notifications.length > 0 ? (
                            notifData.notifications.map((notif: NotificationItem) => (
                                <div key={notif._id} className={`p-3 rounded-xl border transition-all ${
                                    !notif.isRead 
                                        ? 'bg-[#b8004e]/5 border-[#b8004e]/10 dark:bg-pink-500/5 dark:border-pink-500/10' 
                                        : 'bg-gray-50/50 border-gray-100 dark:bg-zinc-800/10 dark:border-zinc-800/50'
                                }`}>
                                    <div className="flex items-start gap-2.5">
                                        <div className="mt-0.5 flex-shrink-0">
                                            <i className={`${getIconClass(notif.type)} text-lg`}></i>
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{notif.title}</p>
                                                {notif.createdAt && !isNaN(new Date(notif.createdAt).getTime()) && (
                                                    <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-semibold whitespace-nowrap">
                                                        {new Date(notif.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-zinc-400 mt-0.5 line-clamp-2">{notif.message}</p>
                                            {notif.reason && (
                                                <div className="text-[10px] font-semibold text-[#b8004e] dark:text-pink-400 mt-1 bg-[#b8004e]/10 dark:bg-pink-500/10 px-2 py-0.5 rounded inline-block">
                                                    Reason: {notif.reason}
                                                </div>
                                            )}
                                            {notif.link && (
                                                <div className="mt-1">
                                                    <Link 
                                                        to={notif.link} 
                                                        onClick={() => setNotifOpen(false)}
                                                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 inline-block hover:underline"
                                                    >
                                                        {notif.type === 'follow' ? 'View Profile →' : 'View Post →'}
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-xs font-medium">
                                No notifications yet.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
