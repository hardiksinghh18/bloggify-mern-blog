import React from 'react'

const LoadingSkeleton = () => {
    return (
        <div div className='flex flex-col w-screen sm:flex-row min-h-80 px-8  sm:px-16  sm:justify-start sm:items-start  mt-8 '>

            <div className="recommendedCard w-fit  sm:px-8  flex flex-col gap-2 justify-center items-center   rounded-2xl animate-pulse">
                <div className='flex w-full ' >
                    <div className="w-16 h-12 bg-gray-300 rounded-full"></div>
                    <div className="w-full px-2 py-1">
                        <div className="w-full bg-gray-300 h-3 mb-2 rounded"></div>
                        <div className="w-20 bg-gray-300 h-3 rounded"></div>
                    </div>
                </div>
                <div className="flex w-full px-2 pb-4 justify-between items-end">
                    <div className="flex flex-col w-full">
                        <div className="w-full bg-gray-300 h-3 mb-2 rounded"></div>
                        <div className="w-20 bg-gray-300 h-3 rounded"></div>
                    </div>
                    {/* <div className="text-sm text-gray-400 hover:border-b-2">Read More</div> */}
                </div>
            </div>


            <div className='flex flex-col  sm:px-8   sm:w-2/3 gap-2'>
                <div className="recommendedCard   flex gap-2 justify-center items-center rounded-2xl animate-pulse">

                    <div className="w-16 h-12 bg-gray-300 rounded-lg"></div>
                    <div className="w-full px-2 py-1">
                        <div className="w-full bg-gray-300 h-3 mb-2 rounded"></div>
                        <div className="w-20 bg-gray-300 h-3 rounded"></div>
                    </div>


                </div>
                <div className="recommendedCard  flex gap-2 justify-center items-center rounded-2xl animate-pulse">

                    <div className="w-16 h-12 bg-gray-300 rounded-lg"></div>
                    <div className="w-full px-2 py-1">
                        <div className="w-full bg-gray-300 h-3 mb-2 rounded"></div>
                        <div className="w-20 bg-gray-300 h-3 rounded"></div>
                    </div>


                </div>
                <div className="recommendedCard  flex gap-2 justify-center items-center rounded-2xl animate-pulse">

                    <div className="w-16 h-12 bg-gray-300 rounded-lg"></div>
                    <div className="w-full px-2 py-1">
                        <div className="w-full bg-gray-300 h-3 mb-2 rounded"></div>
                        <div className="w-20 bg-gray-300 h-3 rounded"></div>
                    </div>


                </div>

            </div>




        </div>
    )
}

export default LoadingSkeleton
