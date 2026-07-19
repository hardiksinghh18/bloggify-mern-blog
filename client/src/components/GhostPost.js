import React from 'react'

const GhostPost = () => {
  return (
    <div className="w-full flex flex-col-reverse sm:flex-row justify-between items-start gap-6 py-8 border-b border-gray-200 dark:border-gray-800 pointer-events-none select-none" aria-hidden="true">
      {/* Left: text skeleton */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        {/* Author row */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-zinc-700" />
          <div className="h-3 w-28 rounded-full bg-gray-200 dark:bg-zinc-700" />
        </div>
        {/* Title */}
        <div className="h-6 w-3/4 rounded-full bg-gray-200 dark:bg-zinc-700" />
        <div className="h-6 w-1/2 rounded-full bg-gray-200 dark:bg-zinc-700" />
        {/* Summary */}
        <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-zinc-800 mt-1" />
        <div className="h-3 w-4/5 rounded-full bg-gray-100 dark:bg-zinc-800" />
        {/* Meta */}
        <div className="flex items-center gap-4 mt-2">
          <div className="h-3 w-16 rounded-full bg-gray-200 dark:bg-zinc-700" />
          <div className="h-3 w-8 rounded-full bg-gray-200 dark:bg-zinc-700" />
          <div className="h-3 w-8 rounded-full bg-gray-200 dark:bg-zinc-700" />
          <div className="h-3 w-14 rounded-full bg-gray-200 dark:bg-zinc-700 ml-auto" />
        </div>
      </div>
      {/* Right: image skeleton */}
      <div className="shrink-0 w-full sm:w-[240px] md:w-[280px] h-[160px] rounded-md bg-gray-200 dark:bg-zinc-700" />
    </div>
  )
}

export default GhostPost
