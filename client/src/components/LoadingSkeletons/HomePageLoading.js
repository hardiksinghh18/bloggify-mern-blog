import React from 'react'

const HomePageLoading = () => {
    return (
        <>




            <div className=" w-screen mx-4 my-16 px-2 flex flex-col gap-2 justify-center items-center h-40 lg:h-80 rounded-2xl animate-pulse">
                <div className="w-screen h-40 bg-gray-300 rounded-lg"></div>


            </div>



            <div className='flex  w-screen justify-center items-center'>
                <div className='hidden sm:flex'>
                    <div className="recommendedCard w-80 m-4 px-2 flex flex-col gap-2 justify-center items-center min-h-80  rounded-2xl animate-pulse">
                        <div className="w-72 h-48 bg-gray-300 rounded-lg"></div>
                       
                        
                    </div>
                </div>
                <div className='flex flex-col  px-8   w-scrren gap-2'>
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



        </>
    )
}

export default HomePageLoading
