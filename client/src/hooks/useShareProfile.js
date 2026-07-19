import { toast } from 'react-toastify';

const useShareProfile = () => {
    const shareProfile = async (userProfile) => {
        const profileUrl = `${window.location.origin}/profile/${userProfile?.username}`;
        const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

        if (isMobile && navigator.share) {
            try {
                await navigator.share({
                    title: userProfile?.name,
                    text: `Check out ${userProfile?.name}'s profile on Bloggify!`,
                    url: profileUrl,
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Share failed:', err);
                }
            }
        } else {
            try {
                await navigator.clipboard.writeText(profileUrl);
                toast.success('Profile link copied to clipboard!');
            } catch {
                toast.error('Failed to copy link');
            }
        }
    };

    return shareProfile;
};

export default useShareProfile;
