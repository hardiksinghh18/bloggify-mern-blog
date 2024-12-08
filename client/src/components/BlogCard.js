import React from 'react'

const BlogCard = ({ blog }) => {
    const {_id, title, content, coverImage, author,summary } = blog
    return (
        <>
            <div className="bg-white rounded-lg overflow-hidden  shadow-lg my-4 ">
                <img src={`${process.env.REACT_APP_BASE_URL}/${coverImage}`} alt="Blog Cover Image" className="w-3/6" />
                <div className="px-6 py-4 ">
                    <div className="font-bold text-xl mb-2">{title}</div>
                    <p className="text-gray-700 text-base">
                        {summary}
                    </p>
                    {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
                    <p>Author : {blog?.author?.name}</p>
                </div>
                <div className="px-6 py-4 max-w-fit ">
                    <a href={`blogs/${_id}`} className="text-blue-500 hover:text-blue-700">Read more</a>
                </div>
            </div>

        </>
    )
}

export default BlogCard
