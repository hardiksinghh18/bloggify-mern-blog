import React from 'react'

const LoadingNew = () => {
  return (
    <div className='flex flex-col sm:flex-row w-screen px-16 justify-center items-center sm:h-screen'>

      <div className="recommendedCard w-80 m-4 px-2 flex flex-col gap-2 justify-center items-center min-h-80  rounded-2xl animate-pulse">
        <div className="w-72 h-48 bg-gray-300 rounded-lg"></div>
        <div className="w-full px-2 py-1">
          <div className="w-full bg-gray-300 h-6 mb-2 rounded"></div>
          {/* <p className="w-full text-sm bg-gray-300 h-4 rounded"></p> */}
        </div>
        <div className="flex w-full px-2 pb-4 justify-between items-end">
          <div className="flex flex-col">
            <div className="text-xs flex items-center">
              <div className="w-16 bg-gray-300 h-4 rounded mr-1"></div>
              <div className="w-20 bg-gray-300 h-4 rounded"></div>
            </div>
            <div className="text-xs bg-gray-300 h-4 w-20 rounded mt-1"></div>
          </div>
          {/* <div className="text-sm text-gray-400 hover:border-b-2">Read More</div> */}
        </div>
      </div>


      <div className="recommendedCard w-80 m-4 px-2 flex flex-col gap-2 justify-center items-center min-h-80  rounded-2xl animate-pulse">
        <div className="w-72 h-48 bg-gray-300 rounded-lg"></div>
        <div className="w-full px-2 py-1">
          <div className="w-full bg-gray-300 h-6 mb-2 rounded"></div>
          {/* <p className="w-full text-sm bg-gray-300 h-4 rounded"></p> */}
        </div>
        <div className="flex w-full px-2 pb-4 justify-between items-end">
          <div className="flex flex-col">
            <div className="text-xs flex items-center">
              <div className="w-16 bg-gray-300 h-4 rounded mr-1"></div>
              <div className="w-20 bg-gray-300 h-4 rounded"></div>
            </div>
            <div className="text-xs bg-gray-300 h-4 w-20 rounded mt-1"></div>
          </div>
          {/* <div className="text-sm text-gray-400 hover:border-b-2">Read More</div> */}
        </div>
      </div>


      <div className="recommendedCard w-80 m-4 px-2 flex flex-col gap-2 justify-center items-center min-h-80  rounded-2xl animate-pulse">
        <div className="w-72 h-48 bg-gray-300 rounded-lg"></div>
        <div className="w-full px-2 py-1">
          <div className="w-full bg-gray-300 h-6 mb-2 rounded"></div>
          {/* <p className="w-full text-sm bg-gray-300 h-4 rounded"></p> */}
        </div>
        <div className="flex w-full px-2 pb-4 justify-between items-end">
          <div className="flex flex-col">
            <div className="text-xs flex items-center">
              <div className="w-16 bg-gray-300 h-4 rounded mr-1"></div>
              <div className="w-20 bg-gray-300 h-4 rounded"></div>
            </div>
            <div className="text-xs bg-gray-300 h-4 w-20 rounded mt-1"></div>
          </div>
          {/* <div className="text-sm text-gray-400 hover:border-b-2">Read More</div> */}
        </div>
      </div>

    </div>
  )
}

export default LoadingNew
