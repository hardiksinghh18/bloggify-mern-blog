import React from 'react'

const SideSkeletonRow = ({ index }) => (
    <div className="flex gap-4 items-start p-4 rounded-2xl animate-pulse">
        <div className="text-3xl font-black opacity-10 leading-none select-none mt-1 w-8 h-8 rounded bg-gray-300 dark:bg-gray-400"></div>
        <div className="flex flex-col flex-1 gap-2">
            <div className="w-full h-4 rounded bg-gray-300 dark:bg-gray-400"></div>
            <div className="w-[70%] h-4 rounded bg-gray-300 dark:bg-gray-400"></div>
            <div className="flex items-center gap-2 mt-1">
                <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-500"></div>
                <div className="w-16 h-3 rounded bg-gray-200 dark:bg-gray-500"></div>
                <div className="w-12 h-3 rounded bg-gray-200 dark:bg-gray-500"></div>
            </div>
        </div>
    </div>
)

const HomePageLoading = () => {
    return (
        <>
            {/* Greeting Skeleton */}
            <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 md:px-12 pt-8 sm:pt-12 pb-2 animate-pulse">
                <div className="w-[55%] sm:w-72 h-8 sm:h-10 rounded bg-gray-300 dark:bg-gray-400 mb-2"></div>
                <div className="w-[80%] sm:w-96 h-4 rounded bg-gray-200 dark:bg-gray-500 mt-2"></div>
            </div>

            {/* Featured Section Skeleton */}
            <div className="w-full max-w-6xl mx-auto mt-10 sm:mt-16 px-5 sm:px-8 md:px-12 animate-pulse">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="w-56 h-8 rounded bg-gray-300 dark:bg-gray-400"></div>
                    <div className="w-20 h-5 rounded bg-gray-200 dark:bg-gray-500"></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Hero Card Skeleton */}
                    <div className="flex-1 min-h-[320px] sm:min-h-[400px] rounded-3xl bg-gray-300 dark:bg-gray-400 relative overflow-hidden">
                        {/* Shimmer content at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-20 h-6 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                                <div className="w-16 h-4 rounded bg-gray-400 dark:bg-gray-500"></div>
                            </div>
                            <div className="w-[80%] h-7 rounded bg-gray-400 dark:bg-gray-500"></div>
                            <div className="w-[60%] h-7 rounded bg-gray-400 dark:bg-gray-500"></div>
                            <div className="w-[90%] h-4 rounded bg-gray-400 dark:bg-gray-500"></div>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                                <div className="flex flex-col gap-1">
                                    <div className="w-24 h-3 rounded bg-gray-400 dark:bg-gray-500"></div>
                                    <div className="w-16 h-3 rounded bg-gray-400 dark:bg-gray-500"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Side List Skeleton */}
                    <div className="lg:w-[380px] xl:w-[420px] flex flex-col gap-1">
                        <div className="w-16 h-4 rounded bg-gray-200 dark:bg-gray-500 mb-2 ml-4"></div>
                        <SideSkeletonRow index={0} />
                        <SideSkeletonRow index={1} />
                        <SideSkeletonRow index={2} />
                        <SideSkeletonRow index={3} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePageLoading
