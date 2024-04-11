import React from 'react'

const BlogLoadingSkeleton = () => {
    return (
        <div>
            <div>

                <div>
                    <div className="px-4 lg:px-64 py-4 lg:py-8 flex flex-col items-center justify-center w-full animate-pulse">

                        <div><h2 className="lg:my-2 sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gray-300 w-3/4 h-8 rounded mb-4"></h2></div>

                        <div className="flex justify-between w-full items-center">
                            <div className="flex my-8  justify-start gap-2 items-center">
                                <div className="h-10 sm:h-12 rounded-full bg-gray-300 w-10 sm:w-12 mr-2"></div>
                                <div className="text-[.75rem] sm:text-sm">
                                    <div className="bg-gray-300 w-20 h-4 rounded mb-1"></div>
                                    <div className="bg-gray-300 w-10 h-3 rounded"></div>
                                </div>
                            </div>

                            <div className="flex lg:mx-2 items-center justify-center gap-4 ">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="bg-gray-300 w-6 h-4 rounded mb-1"></div>
                                    <div className="bg-gray-300 w-12 h-3 rounded"></div>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <a href="#comments"><div className="bg-gray-300 w-6 h-4 rounded mb-1"></div></a>
                                    <div className="bg-gray-300 w-12 h-3 rounded"></div>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <div className="bg-gray-300 w-6 h-4 rounded mb-1"></div>
                                    <div className="bg-gray-300 w-12 h-3 rounded"></div>
                                </div>
                            </div>
                        </div>
                        <div className="blogContent w-full">
                            <div className="h-96 bg-gray-300 w-full rounded mb-8"></div>
                            <div>
                                <p className="mt-8 text-sm bg-gray-300 w-full h-4 rounded"></p>
                            </div>
                            <div className="my-8 text-sm bg-gray-300 w-full h-40 rounded"></div>
                        </div>
                    </div>

                    <div id="comments" className="comment_section w-full px-4 lg:px-64 my-8 ">
                        <h1 className="font-bold text-sm sm:text-lg lg:text-xl bg-gray-300 w-24 h-6 rounded mb-4"></h1>
                        <div className="bg-gray-300 w-full h-96 rounded"></div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default BlogLoadingSkeleton
