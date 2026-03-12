import React from 'react'

const SkeletonRow = () => (
  <div className="w-full flex flex-col-reverse sm:flex-row justify-between items-start gap-6 py-8 border-b border-gray-200 dark:border-gray-800 animate-pulse">
    {/* Left content */}
    <div className="flex-1 flex flex-col gap-3 w-full">
      {/* Author */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-400"></div>
        <div className="w-24 h-3 rounded bg-gray-300 dark:bg-gray-400"></div>
      </div>

      {/* Title */}
      <div className="w-[85%] h-6 rounded bg-gray-300 dark:bg-gray-400"></div>
      <div className="w-[60%] h-6 rounded bg-gray-300 dark:bg-gray-400"></div>

      {/* Summary */}
      <div className="w-full h-4 rounded bg-gray-200 dark:bg-gray-400"></div>
      <div className="w-[75%] h-4 rounded bg-gray-200 dark:bg-gray-400"></div>

      {/* Meta row */}
      <div className="flex items-center gap-4 mt-2">
        <div className="w-20 h-3 rounded bg-gray-200 dark:bg-gray-400"></div>
        <div className="w-10 h-3 rounded bg-gray-200 dark:bg-gray-400"></div>
        <div className="w-10 h-3 rounded bg-gray-200 dark:bg-gray-400"></div>
        <div className="w-10 h-3 rounded bg-gray-200 dark:bg-gray-400"></div>
      </div>
    </div>

    {/* Thumbnail */}
    <div className="shrink-0 w-full sm:w-[240px] md:w-[280px] h-[160px] rounded-md bg-gray-300 dark:bg-gray-400"></div>
  </div>
)

const LoadingNew = () => {
  return (
    <div className='w-full max-w-5xl flex flex-col px-4 sm:px-8 lg:px-16 my-8 mx-auto'>
      {/* Header */}
      <div className="w-32 h-7 rounded bg-gray-300 dark:bg-gray-400 my-4 animate-pulse"></div>
      <div className="w-full h-px bg-gray-200 dark:bg-gray-400 mb-2"></div>

      {/* Rows */}
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </div>
  )
}

export default LoadingNew
