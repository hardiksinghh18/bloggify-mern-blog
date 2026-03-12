import React from 'react'

const CoverSection = ({ userName }) => {
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  let emoji = '🌙';
  
  if (hour >= 5 && hour < 12) {
    greeting = 'Good morning';
    emoji = '☀️';
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
    emoji = '🌤️';
  }

  const firstName = userName ? userName.split(' ')[0] : '';

  return (
    <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 md:px-12 pt-8 sm:pt-12 pb-2">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          {greeting}, {firstName} <span className="inline-block animate-[wave_1.5s_ease-in-out_infinite]">{emoji}</span>
        </h1>
        <p className="text-sm sm:text-base opacity-60 font-medium mt-1">
          Read, write, and share stories that matter — your ideas deserve a voice.
        </p>
      </div>
    </div>
  )
}

export default CoverSection
