import React from 'react'
import defaultProfile from '../images/defaultProfile.jpg'
import { useGetTrendingBlogsQuery } from '../features/blogs/blogsApiSlice'
import { slugify } from '../Utils/slugify'

const FeaturedSection = ({ blogsData }) => {
    const { data: trendingData } = useGetTrendingBlogsQuery(5);

    // Use trending blogs if available, otherwise fall back to blogsData
    const trendingBlogs = trendingData?.trendingBlogs;
    const heroPost = trendingBlogs?.[0] || blogsData?.[0];
    const sidePosts = trendingBlogs?.slice(1, 5) || blogsData?.slice(1, 5);

    const heroDate = heroPost?.createdAt ? new Date(heroPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
    const heroProfileImage = heroPost?.author?.profileImage || defaultProfile;

    // Estimate read time
    const heroContent = heroPost?.content ? heroPost.content.replace(/<[^>]*>?/gm, '') : '';
    const heroReadTime = Math.ceil(heroContent.trim().split(/\s+/).length / 200);

    // Format engagement stats
    const formatCount = (num) => {
        if (!num) return '0';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    };

    return (
        <section className="w-full max-w-6xl mx-auto mt-10 sm:mt-16 px-5 sm:px-8 md:px-12">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Trending on <span className="text-blue-600 dark:text-blue-400">Bloggify</span>
                    </h2>
                </div>
                <a href="/blogs" className="text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-4 transition-colors">
                    View all →
                </a>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Hero Card */}
                {heroPost && (
                    <a href={`/blogs/${heroPost?._id}/${slugify(heroPost?.title)}`} className="group relative flex-1 min-h-[320px] sm:min-h-[400px] rounded-3xl overflow-hidden block">
                        <img
                            src={heroPost?.coverImage}
                            alt={heroPost?.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xs font-bold text-white/90 bg-blue-600/80 backdrop-blur-sm px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" /></svg>
                                    Trending
                                </span>
                                <span className="text-xs text-white/70">{heroReadTime} min read</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight mb-3 line-clamp-3">
                                {heroPost?.title}
                            </h2>
                            <p className="text-sm text-white/70 line-clamp-2 mb-4 max-w-lg">
                                {heroPost?.summary}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={heroProfileImage} alt={heroPost?.author?.name} className="w-8 h-8 rounded-full object-cover border-2 border-white/30" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-white">{heroPost?.author?.name}</span>
                                        <span className="text-xs text-white/60">{heroDate}</span>
                                    </div>
                                </div>
                                {/* Engagement stats for hero */}
                                {trendingBlogs && (
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1 text-xs text-white/60">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            {formatCount(heroPost?.views)}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-white/60">
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                                            {formatCount(heroPost?.likes?.length)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </a>
                )}

                {/* Side Posts */}
                <div className="lg:w-[380px] xl:w-[420px] flex flex-col gap-1">
                    <h3 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-2 px-4">
                        {trendingBlogs ? 'Top Rising' : 'Latest'}
                    </h3>
                    {sidePosts?.map((blog, index) => {
                        const postDate = blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
                        const profileImg = blog?.author?.profileImage || defaultProfile;
                        return (
                            <a key={blog?._id || index} href={`/blogs/${blog?._id}/${slugify(blog?.title)}`} className="group flex gap-4 items-start p-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors duration-200">
                                <span className="text-3xl font-black opacity-10 leading-none select-none mt-1">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <div className="flex flex-col flex-1 gap-1.5">
                                    <h3 className="text-sm sm:text-[15px] font-bold leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {blog?.title}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <img src={profileImg} alt={blog?.author?.name} className="w-4 h-4 rounded-full object-cover" />
                                        <span className="text-xs font-medium opacity-60">{blog?.author?.name}</span>
                                        <span className="text-xs font-medium opacity-60">·</span>
                                        <span className="text-xs font-medium opacity-60">{postDate}</span>
                                        {trendingBlogs && (
                                            <>
                                                <span className="text-xs font-medium opacity-60">·</span>
                                                <span className="flex items-center gap-0.5 text-xs font-medium opacity-60">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                    {formatCount(blog?.views)}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </a>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default FeaturedSection
