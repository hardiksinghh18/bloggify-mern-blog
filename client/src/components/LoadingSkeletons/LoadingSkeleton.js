import React from 'react'

const BlogRowSkeleton = () => (
    <div className="w-full flex flex-col-reverse sm:flex-row justify-between items-start gap-6 py-8 border-b border-gray-200 dark:border-gray-800 animate-pulse">
        <div className="flex-1 flex flex-col gap-3 w-full">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-400"></div>
                <div className="w-24 h-3 rounded bg-gray-300 dark:bg-gray-400"></div>
            </div>
            <div className="w-[85%] h-6 rounded bg-gray-300 dark:bg-gray-400"></div>
            <div className="w-[60%] h-6 rounded bg-gray-300 dark:bg-gray-400"></div>
            <div className="w-full h-4 rounded bg-gray-200 dark:bg-gray-500"></div>
            <div className="w-[75%] h-4 rounded bg-gray-200 dark:bg-gray-500"></div>
            <div className="flex items-center gap-4 mt-2">
                <div className="w-20 h-3 rounded bg-gray-200 dark:bg-gray-500"></div>
                <div className="w-10 h-3 rounded bg-gray-200 dark:bg-gray-500"></div>
                <div className="w-10 h-3 rounded bg-gray-200 dark:bg-gray-500"></div>
            </div>
        </div>
        <div className="shrink-0 w-full sm:w-[240px] md:w-[280px] h-[160px] rounded-md bg-gray-300 dark:bg-gray-400"></div>
    </div>
)

const LoadingSkeleton = () => {
    return (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 animate-pulse">

            {/* Profile Header Skeleton */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 pb-8 border-b border-gray-200 dark:border-gray-800">
                {/* Avatar */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-300 dark:bg-gray-400 shrink-0"></div>

                {/* Info */}
                <div className="flex-1 flex flex-col items-center sm:items-start gap-3 w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-48 h-8 rounded bg-gray-300 dark:bg-gray-400"></div>
                        <div className="w-16 h-6 rounded-full bg-gray-200 dark:bg-gray-500"></div>
                    </div>
                    <div className="w-40 h-4 rounded bg-gray-200 dark:bg-gray-500"></div>
                    <div className="w-72 h-4 rounded bg-gray-200 dark:bg-gray-500 mt-1"></div>
                    <div className="w-56 h-4 rounded bg-gray-200 dark:bg-gray-500"></div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mt-4">
                        <div className="flex flex-col items-center sm:items-start gap-1">
                            <div className="w-8 h-7 rounded bg-gray-300 dark:bg-gray-400"></div>
                            <div className="w-10 h-3 rounded bg-gray-200 dark:bg-gray-500"></div>
                        </div>
                        <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
                        <div className="flex flex-col items-center sm:items-start gap-1">
                            <div className="w-10 h-7 rounded bg-gray-300 dark:bg-gray-400"></div>
                            <div className="w-10 h-3 rounded bg-gray-200 dark:bg-gray-500"></div>
                        </div>
                        <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
                        <div className="flex flex-col items-center sm:items-start gap-1">
                            <div className="w-8 h-7 rounded bg-gray-300 dark:bg-gray-400"></div>
                            <div className="w-10 h-3 rounded bg-gray-200 dark:bg-gray-500"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blogs Section Skeleton */}
            <div className="mt-8">
                <div className="w-32 h-6 rounded bg-gray-300 dark:bg-gray-400 mb-4"></div>
                <BlogRowSkeleton />
                <BlogRowSkeleton />
                <BlogRowSkeleton />
            </div>
        </div>
    )
}

export default LoadingSkeleton
