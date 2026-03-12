import { toast } from 'react-toastify';

const useShareBlog = () => {
    const shareBlog = async (blog, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const blogUrl = `${window.location.origin}/blogs/${blog?._id}/${blog?.title}`;
        const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

        if (isMobile && navigator.share) {
            try {
                await navigator.share({
                    title: blog?.title,
                    text: blog?.summary || `Check out this blog: ${blog?.title}`,
                    url: blogUrl,
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Share failed:', err);
                }
            }
        } else {
            try {
                await navigator.clipboard.writeText(blogUrl);
                toast.success('Link copied to clipboard!');
            } catch {
                toast.error('Failed to copy link');
            }
        }
    };

    return shareBlog;
};

export default useShareBlog;
